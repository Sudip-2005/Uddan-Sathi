from dotenv import load_dotenv
import os
import json
import io
import traceback
import resend
from datetime import datetime
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from firebase_config import get_database


# Load environment variables (keeping your .env preference)
load_dotenv()

app = Flask(__name__)

# --- Configuration ---
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
CORS(app, resources={r"/*": {"origins": FRONTEND_URL}}, supports_credentials=True)

@app.route("/")
def home():
    return jsonify({
        "status": "backend running", 
        "structure": "hierarchical", 
        "version": "2.0 (Real-World Data)"
    })

# --- 1. Get All Flights (Traverses Airports Node) ---
@app.route("/flights", methods=["GET"])
def get_flights():
    try:
        root = get_database()
        airports = root.child("airports").get()

        if not airports:
            return jsonify({"ok": True, "data": []}), 200

        flights_list = []
        # Traverse: Airports -> Flight IDs
        for air_code, air_data in airports.items():
            flights = air_data.get("flights", {})
            for f_id, f_info in flights.items():
                if isinstance(f_info, dict):
                    f_info["id"] = f_id
                    f_info["source"] = air_code
                    # Map dep_time from your new generator to departure_time for frontend
                    f_info["departure_time"] = f_info.get("dep_time")
                    flights_list.append(f_info)
        
        return jsonify({"ok": True, "data": flights_list}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500

# --- 2. Search Flights by Route (Optimized Pathing) ---
@app.route("/flights/search", methods=["GET"])
def search_flights():
    try:
        source = request.args.get('source', '').upper()
        destination = request.args.get('destination', '').upper()

        if not source or not destination:
            return jsonify({"ok": False, "error": "Source and destination are required"}), 400

        root = get_database()
        # Direct parent access using the 'source' airport code
        airport_data = root.child("airports").child(source).get()

        if not airport_data:
            return jsonify({"ok": True, "data": []}), 200

        filtered_flights = []
        flights = airport_data.get("flights", {})
        for f_id, f_info in flights.items():
            # Matches 'destination' key in your new JSON
            if f_info.get("destination", "").upper() == destination:
                f_info["id"] = f_id
                f_info["source"] = source
                f_info["departure_time"] = f_info.get("dep_time")
                if "price" not in f_info:
                    f_info["price"] = "₹4,999"
                filtered_flights.append(f_info)
        
        return jsonify({"ok": True, "data": filtered_flights}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500

# --- 3. Get Booking by PNR (Deep Traverse Search) ---
@app.route("/bookings/<pnr>", methods=["GET"])
def get_booking_by_pnr(pnr):
    try:
        pnr = pnr.upper()
        root = get_database()
        airports = root.child("airports").get()

        if not airports:
            return jsonify({"ok": False, "error": "Database empty"}), 404

        # Search inside every airport node for the specific PNR
        for air_code, air_data in airports.items():
            flights = air_data.get("flights", {})
            for f_id, f_data in flights.items():
                passengers = f_data.get("passengers", {})
                if pnr in passengers:
                    p_info = passengers[pnr]
                    return jsonify({
                        "pnr": pnr,
                        "passenger_name": p_info.get("name"),
                        "flight_id": f_id,
                        "source": air_code,
                        "destination": f_data.get("destination"),
                        "dest_city": f_data.get("dest_city"),
                        "departure_time": f_data.get("dep_time"),
                        "arrival_time": f_data.get("arrival_time"),
                        "status": p_info.get("status", "Confirmed"),
                        "seat": p_info.get("seat"),
                        "airline": f_data.get("airline"),
                        "booking_date": p_info.get("booking_date")
                    }), 200

        return jsonify({"ok": False, "error": "Booking not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500

# --- 4. Add Flight (Hierarchical Entry) ---
@app.route("/add-flight", methods=["POST"])
def add_flight():
    try:
        data = request.get_json(force=True)
        source = data.get("source", "UNKNOWN").upper()
        flight_id = data.get("flight_no")
        
        # Keep keys consistent with your generator
        if "departure_time" in data:
            data["dep_time"] = data.pop("departure_time")

        root = get_database()
        # airports -> {source} -> flights -> {flight_id}
        root.child("airports").child(source).child("flights").child(flight_id).set(data)
        
        return jsonify({"ok": True, "message": "Flight added to database"}), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500

# --- 5. Cancel Flight & Notify Passengers ---
import resend
import os
from datetime import datetime
import traceback
from flask import jsonify, request

# Initialize Resend
resend.api_key = os.getenv("RESEND_API_KEY")

def send_professional_email(passenger_email, passenger_name, flight_id, source, destination, reason):
    """Sends a high-end, airline-style cancellation email."""
    
    # Professional HTML Template
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">UDAAN SATHI</h1>
            <p style="color: #fee2e2; margin: 5px 0 0 0;">Important Travel Update</p>
        </div>
        <div style="padding: 30px; color: #333; line-height: 1.6;">
            <h2 style="color: #111;">Flight Cancellation Notice</h2>
            <p>Dear <strong>{passenger_name}</strong>,</p>
            <p>We regret to inform you that your upcoming flight <strong>{flight_id}</strong> from <strong>{source}</strong> to <strong>{destination}</strong> has been cancelled due to <strong>{reason}</strong>.</p>
            
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px border-left: 4px solid #dc2626;">
                <p style="margin: 0;"><strong>Flight Number:</strong> {flight_id}</p>
                <p style="margin: 5px 0 0 0;"><strong>Route:</strong> {source} &rarr; {destination}</p>
            </div>

            <p>Your comfort and safety are our priorities. We have already prepared your options in the <strong>Disruption Control Center</strong>:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5173/user/disruption" 
                   style="background-color: #dc2626; color: white; padding: 14px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                   View Refund & Rebooking Options
                </a>
            </div>

            <p style="font-size: 14px; color: #666;">
                If you require immediate assistance, please visit our help desk at the airport or reply to this email.
            </p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
            &copy; 2025 Udaan Sathi Airlines. All rights reserved.
        </div>
    </div>
    """

    try:
        resend.Emails.send({
            "from": "Udaan Sathi <onboarding@resend.dev>",
            "to": passenger_email,
            "subject": f"URGENT: Your flight {flight_id} has been cancelled",
            "html": html_content
        })
        return True
    except Exception as e:
        print(f"Email Error: {e}")
        return False

@app.route("/cancel-flight", methods=["POST"])
def cancel_flight():
    try:
        data = request.get_json()
        flight_id = data.get("flight_id")
        source = data.get("source", "").upper()
        reason = data.get("reason", "Operational reasons")

        root = get_database()
        flight_ref = root.child("airports").child(source).child("flights").child(flight_id)
        flight_data = flight_ref.get()

        if not flight_data:
            return jsonify({"ok": False, "error": "Flight not found in active database"}), 404

        # 1. ARCHIVE: Save to cancelled_flights with full passenger list
        archive_data = {
            **flight_data,
            "status": "CANCELLED",
            "cancel_reason": reason,
            "cancelled_at": datetime.utcnow().isoformat()
        }
        root.child("cancelled_flights").child(flight_id).set(archive_data)

        # 2. NOTIFY & EMAIL: Process each passenger
        passengers = flight_data.get("passengers", {})
        destination = flight_data.get("destination", "Destination")
        
        for pnr, p_info in passengers.items():
            email = p_info.get("email")
            name = p_info.get("name")

            # Push App Notification
            notification = {
                "title": "FLIGHT CANCELLED",
                "message": f"Flight {flight_id} to {destination} cancelled. Reason: {reason}.",
                "type": "CANCELLED",
                "timestamp": datetime.utcnow().isoformat()
            }
            root.child("notifications").child(pnr).push(notification)

            # Send Professional Email
            if email:
                send_professional_email(email, name, flight_id, source, destination, reason)

        # 3. DELETE: Remove from active airport flights
        flight_ref.delete()

        return jsonify({"ok": True, "message": "Flight cancelled, archived, and emails sent."}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500

# --- 6. Ticket Download (ReportLab PDF) ---
@app.route("/bookings/<pnr>/ticket", methods=["GET"])
def download_ticket(pnr):
    try:
        # Reuse internal logic to find the booking
        response, status = get_booking_by_pnr(pnr)
        if status != 200:
            return response
        
        booking = response.get_json()
        buffer = io.BytesIO()
        from reportlab.pdfgen import canvas
        
        p = canvas.Canvas(buffer)
        p.setFont("Helvetica-Bold", 18)
        p.drawString(100, 800, "UDAAN SATHI E-TICKET")
        p.setFont("Helvetica", 12)
        
        y = 750
        for key, value in booking.items():
            p.drawString(100, y, f"{key.upper()}: {value}")
            y -= 25
            
        p.showPage()
        p.save()
        buffer.seek(0)
        return send_file(buffer, mimetype="application/pdf", as_attachment=True, download_name=f"ticket_{pnr}.pdf")
    except Exception as e:
        return jsonify({"ok": False, "error": "PDF Generation failed: " + str(e)}), 500

# --- 7. Get Notifications for PNR ---
@app.route("/notifications/<pnr>", methods=["GET"])
def get_notifications(pnr):
    try:
        root = get_database()
        data = root.child("notifications").child(pnr.upper()).get()
        # Convert dictionary of push-IDs to a clean list for frontend
        notifs = [{"id": k, **v} for k, v in data.items()] if data else []
        return jsonify({"ok": True, "data": notifs}), 200
    except Exception:
        return jsonify({"ok": True, "data": []}), 200

@app.route("/delay-flight", methods=["POST"])
@app.route("/delay-flight", methods=["POST"])
def delay_flight():
    try:
        data = request.get_json()
        flight_id = data.get("flight_id") # e.g., 6E213
        source = data.get("source").upper()
        new_time = data.get("new_time")
        
        root = get_database() # Your Firebase reference
        
        # 1. Update flight time (You said this part works)
        flight_ref = root.child("airports").child(source).child("flights").child(flight_id)
        flight_ref.update({"dep_time": new_time})

        # 2. Get all passengers for this flight
        # IMPORTANT: Make sure your flights in DB have a 'passengers' node
        passengers = flight_ref.child("passengers").get()
        
        if not passengers:
            return jsonify({"ok": False, "message": "No passengers found on this flight"}), 404

        # 3. CREATE THE NOTIFICATIONS SECTION
        for pnr in passengers:
            alert_data = {
                "message": f"Flight {flight_id} is delayed to {new_time}.",
                "type": "DELAYED",
                "created_at": datetime.utcnow().isoformat()
            }
            # This line forced Firebase to create the 'notifications' folder
            root.child("notifications").child(pnr).push(alert_data)

        return jsonify({"ok": True, "message": "Notifications created in DB"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)