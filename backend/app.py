from dotenv import load_dotenv
import os
import json
import requests

load_dotenv()

from flask import Flask, jsonify, request
from firebase_config import get_database
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"status": "backend running"})

# --- Get all flights ---
@app.route("/flights", methods=["GET"])
def get_flights():
    try:
        # get_database() returns db.reference("/")
        root = get_database()
        
        # .get() returns a DICTIONARY directly. 
        # Logic: root -> node 'flights' -> get data
        data = root.child("flights").get()

        if not data:
            return jsonify({"ok": True, "data": []}), 200

        flights = []
        # data is { "id1": {details}, "id2": {details} }
        for flight_id, flight_data in data.items():
            if isinstance(flight_data, dict):
                flight_data["id"] = flight_id
                flights.append(flight_data)
        
        return jsonify({"ok": True, "data": flights}), 200
    except Exception as e:
        print("GET FLIGHTS ERROR:", e)
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500

# --- Add flight ---
@app.route("/add-flight", methods=["POST"])
def add_flight():
    try:
        data = request.get_json(force=True)
        root = get_database()
        
        # .push() sends data and returns a reference to the new node
        new_ref = root.child("flights").push(data)
        
        return jsonify({
            "ok": True, 
            "message": "Flight added", 
            "flight_id": new_ref.key  # Use .key to get the ID
        }), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500

# --- Cancel flight ---
from datetime import datetime

@app.route("/cancel-flight", methods=["POST"])
def cancel_flight():
    try:
        data = request.get_json()
        flight_id = data.get("flight_id")
        reason = data.get("reason", "Operational reasons")

        root = get_database()

        # Fetch flight
        flight_data = root.child("flights").child(flight_id).get()
        if not flight_data:
            return jsonify({"ok": False, "error": "Flight not found"}), 404

        passengers = flight_data.get("passengers", {})

        # Create notifications for each passenger
        for pnr, passenger in passengers.items():
            notification = {
                "flight_id": flight_id,
                "message": f"Your flight {flight_id} has been cancelled due to {reason}.",
                "type": "CANCELLED",
                "created_at": datetime.utcnow().isoformat()
            }

            root.child("notifications").child(pnr).push(notification)

        # Move flight to cancelled_flights
        root.child("cancelled_flights").push({
            "flight_id": flight_id,
            "original_data": flight_data,
            "reason": reason,
            "cancel_time": datetime.utcnow().isoformat()
        })

        # Remove from active flights
        root.child("flights").child(flight_id).delete()

        return jsonify({
            "ok": True,
            "message": "Flight cancelled and passengers notified",
            "notified_passengers": list(passengers.keys())
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500
    




@app.route("/admin/init-database", methods=["POST"])
def init_database():
    db = get_database()

    file_path = os.path.join(
        os.path.dirname(__file__),
        "initial_flight_data.json"
    )

    with open(file_path, "r") as f:
        data = json.load(f)

    # Push each top-level key to Firebase
    for key, value in data.items():
        db.child(key).set(value)

    return jsonify({
        "message": "Initial flight database uploaded successfully"
    }), 200
@app.route("/admin/add-passenger", methods=["POST"])
def add_passenger():
    data = request.json
    flight_id = data["flight_id"]
    pnr = data["pnr"]

    passenger_data = {
        "name": data["name"],
        "seat": data["seat"],
        "email": data["email"]
    }

    db = get_database()
    db.child("flights").child(flight_id).child("passengers").child(pnr).set(passenger_data)

    return jsonify({"message": "Passenger added successfully"}), 200
@app.route("/notifications/<pnr>", methods=["GET"])
def get_notifications(pnr):
    root = get_database()
    data = root.child("notifications").child(pnr).get()

    if not data:
        return jsonify({"ok": True, "data": []}), 200

    notifications = []
    for notif_id, notif in data.items():
        notif["id"] = notif_id
        notifications.append(notif)

    return jsonify({"ok": True, "data": notifications}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

