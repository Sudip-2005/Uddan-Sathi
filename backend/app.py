from dotenv import load_dotenv
import os

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
@app.route("/cancel-flight", methods=["POST"])
def cancel_flight():
    try:
        data = request.get_json()
        flight_id = data.get("flight_id")
        root = get_database()

        # Fetch the flight data (returns a dict)
        flight_data = root.child("flights").child(flight_id).get()
        
        if not flight_data:
            return jsonify({"ok": False, "error": "Flight not found"}), 404

        # 1. Store in cancelled_flights
        root.child("cancelled_flights").push({
            "flight_id": flight_id,
            "original_data": flight_data,
            "reason": data.get("reason"),
            "cancel_time": data.get("cancel_time")
        })

        # 2. Delete from active flights
        root.child("flights").child(flight_id).delete()

        return jsonify({"ok": True, "message": "Flight cancelled"}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    import json
import os

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
