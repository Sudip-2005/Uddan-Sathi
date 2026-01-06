from dotenv import load_dotenv
import os
import json
import io
import traceback
import resend
from datetime import datetime
from flask import Flask, jsonify, request, send_file, make_response
from flask_cors import CORS
from firebase_config import get_database
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import db
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import logging

import firebase_admin
from firebase_admin import credentials, db

# ensure .env is loaded early
load_dotenv()

app = Flask(__name__)

# Configure CORS to allow your specific frontend and enable credentials
CORS(app, 
     resources={r"/*": {"origins": [
         "http://localhost:5173",
         "http://localhost:5174",
         "https://uddan-sathi.vercel.app",
         "https://udaan-sathi.vercel.app"
     ]}}, 
     supports_credentials=True)

# Set up logging to track cancellation requests
logging.basicConfig(level=logging.INFO)

# Define root for refund storage
ROOT = "refund_requests"

# --- UPDATED INITIALIZATION ---
FIREBASE_CRED_PATH = os.environ.get("FIREBASE_CRED_PATH")
DATABASE_URL = os.environ.get("FIREBASE_DATABASE_URL")

FIREBASE_INITIALIZED = False

# 1. Check if the path exists first
if FIREBASE_CRED_PATH and os.path.exists(FIREBASE_CRED_PATH):
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(FIREBASE_CRED_PATH)
            firebase_admin.initialize_app(cred, {"databaseURL": DATABASE_URL})
        
        # Mark Firebase as initialized so other helpers can use it
        FIREBASE_INITIALIZED = True
        app.logger.info(f"✅ Firebase initialized using: {FIREBASE_CRED_PATH}")
    except Exception as e:
        app.logger.error(f"❌ Failed to load certificate: {e}")
else:
    # 2. If path is wrong, print EXACTLY what the app is seeing
    app.logger.error("CRITICAL: Firebase Credentials not found!")
    app.logger.error(f"Looking for file at: '{FIREBASE_CRED_PATH}'")
    app.logger.error("Check your .env file and ensure the path is absolute (e.g., C:\\Users\\...)")

# --- UPDATED HELPERS ---

def safe_ref(path: str):
    """Safety wrapper to prevent 'DefaultCredentialsError' crashes"""
    if not FIREBASE_INITIALIZED:
        app.logger.error("Attempted to access database before Firebase was initialized.")
        raise RuntimeError("Firebase not initialized. Check FIREBASE_CRED_PATH in your .env")
    return db.reference(path)

def get_database():
    """Update this to use safe_ref so it doesn't bypass initialization checks"""
    return safe_ref("/")

@app.route("/")
def home():
    return jsonify({
        "status": "backend running", 
        "structure": "hierarchical", 
        "version": "2.0 (Real-World Data)"
    })

# --- 1. Get All Flights (Traverses Airports Node) ---
from flask import request, jsonify
import traceback

# List of supported airports for validation
SUPPORTED_AIRPORTS = [
    "AMS", "BKK", "BLR", "BOM", "CAN", "CCU", "CDG", "DEL", "DFW", 
    "DOH", "DXB", "FRA", "HKG", "HND", "ICN", "IST", "JFK", "LAX", 
    "LHR", "MAA", "ORD", "SFO", "SIN", "SYD", "YYZ"
]

@app.route("/flights", methods=["GET"])
def get_flights():
    try:
        # 1. Get and sanitize airport code
        target_airport = request.args.get('airport', '').strip().upper()
        
        # 2. Validation
        if not target_airport or target_airport not in SUPPORTED_AIRPORTS:
            return jsonify({
                "ok": True, 
                "data": [], 
                "message": f"Airport {target_airport} not supported or missing"
            }), 200

        root = get_database()
        
        # 3. Access the specific branch
        # .get() on a node that doesn't exist returns None
        flights_node = root.child("airports").child(target_airport).child("flights").get()
        
        # 4. Handle Empty or Non-Dictionary results
        if not flights_node:
            return jsonify({"ok": True, "data": []}), 200

        flights_list = []

        # FIX: Ensure flights_node is a dictionary. 
        # If Firebase keys are numeric, it might mistakenly return a List.
        if isinstance(flights_node, list):
            # If it's a list, enumerate it to get index as ID
            iterable = enumerate(flights_node)
        elif isinstance(flights_node, dict):
            iterable = flights_node.items()
        else:
            return jsonify({"ok": True, "data": []}), 200

        for f_id, f_info in iterable:
            if f_info and isinstance(f_info, dict):
                # Map all keys to what React AdminDashboard expects
                flight_obj = {
                    "id": str(f_id), # The key (e.g., 6E203)
                    "airline": f_info.get("airline", "Unknown"),
                    "source": target_airport,
                    "destination": f_info.get("destination", "N/A"),
                    "dest_city": f_info.get("dest_city", "N/A"),
                    "departure_time": f_info.get("dep_time", "N/A"), # Map dep_time -> departure_time
                    "arrival_time": f_info.get("arrival_time", "N/A"),
                    "status": f_info.get("status", "Scheduled"),
                    "passengers": f_info.get("passengers", {})
                }
                flights_list.append(flight_obj)

        return jsonify({"ok": True, "data": flights_list}), 200

    except Exception as e:
        print(f"CRITICAL ERROR in /flights: {e}")
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
        # Accept multiple possible field names coming from different frontends
        flight_id = data.get("flight_no") or data.get("flight_number") or data.get("flight_id") or data.get("id")
        source = (data.get("source") or data.get("origin") or data.get("source_code") or "").strip().upper() or None

        # Validate required fields early with helpful errors
        if not flight_id:
            return jsonify({"ok": False, "error": "Missing flight identifier (flight_no or flight_number)"}), 400
        if not source:
            return jsonify({"ok": False, "error": "Missing source airport code"}), 400

        flight_id = str(flight_id)
        
        # Keep keys consistent with your generator
        if "departure_time" in data:
            data["dep_time"] = data.pop("departure_time")

        root = get_database()
        # Normalize some common fields before storing
        if "departure_time" in data:
            data["dep_time"] = data.pop("departure_time")
        # Ensure airline field exists
        data["airline"] = data.get("airline_name") or data.get("airline") or data.get("airline_code")

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
    
# --- ADD THESE TO app.py ---

@app.route('/api/refunds', methods=['GET'])
def get_refund_requests():
    try:
        # Access the cancelled_flights node
        ref = db.reference('cancelled_flights')
        data = ref.get()
        
        refund_list = []
        if data:
            for flight_id, flight_info in data.items():
                passengers = flight_info.get('passengers', {})
                for pax_id, details in passengers.items():
                    # Flattening data for the frontend table
                    refund_list.append({
                        "id": pax_id,
                        "flight_id": flight_id,
                        "name": details.get('name'),
                        "pnr": details.get('pnr'),
                        "amount": details.get('amount', '5500'), # Default if missing
                        "upi": details.get('upi', 'N/A'),
                        "email": details.get('email')
                    })
        
        return jsonify(refund_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/refunds/<flight_id>/<pax_id>', methods=['DELETE'])
def process_refund(flight_id, pax_id):
    try:
        # Remove the specific passenger child
        ref = db.reference(f'cancelled_flights/{flight_id}/passengers/{pax_id}')
        ref.delete()
        return jsonify({"message": "Refund processed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- New: read refund_requests node so admin can see user-submitted requests (amounts, reason, upi, etc.) ---

from flask import make_response

# HELPER FUNCTION FOR CORS - MUST BE DEFINED BEFORE ROUTES THAT USE IT
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# HELPER: Local fallback for refund data (returns empty dict if no local file)
def _read_local_refunds():
    """Returns local refund data from file if Firebase is unavailable."""
    try:
        local_path = os.path.join(os.path.dirname(__file__), "local_refunds.json")
        if os.path.exists(local_path):
            with open(local_path, "r") as f:
                return json.load(f)
    except Exception as e:
        app.logger.debug("Local refunds file not available: %s", e)
    return {}

# =============================================================================
# REFUND ROUTES - Supporting both /api/refunds/* and /api/refund_requests/*
# =============================================================================

# Route 1: List flights with refund requests for an airport (e.g., /api/refunds/DEL)
@app.route("/api/refunds/<airport_code>", methods=["GET", "OPTIONS"], strict_slashes=False)
@app.route("/api/refund_requests/<airport_code>", methods=["GET", "OPTIONS"], strict_slashes=False)
def list_refund_flights_by_airport(airport_code):
    if request.method == "OPTIONS":
        res = make_response("", 200)
        return add_cors_headers(res)
    
    try:
        ref = safe_ref(f"refund_requests/{airport_code.upper()}")
        data = ref.get() or {}
        result = []
        if isinstance(data, dict):
            for flight_id, pax_map in data.items():
                count = len(pax_map) if isinstance(pax_map, dict) else 0
                result.append({"flight_id": flight_id, "count": count})
        
        return add_cors_headers(jsonify(result)), 200
    except Exception as e:
        app.logger.exception("list_refund_flights_by_airport error: %s", e)
        return add_cors_headers(jsonify({"error": str(e)})), 500

# Route 2: Get refund requests for a specific flight (e.g., /api/refunds/DEL/QR621)
@app.route("/api/refunds/<airport_code>/<flight_id>", methods=["GET", "OPTIONS"], strict_slashes=False)
@app.route("/api/refund_requests/<airport_code>/<flight_id>", methods=["GET", "OPTIONS"], strict_slashes=False)
def get_refund_requests_by_flight(airport_code, flight_id):
    app.logger.info("🚀 HIT: Manifest for %s/%s", airport_code, flight_id)
    
    # --- PREFLIGHT CORS FIX ---
    if request.method == "OPTIONS":
        res = make_response("", 200)
        return add_cors_headers(res)

    airport_code = (airport_code or "").upper()
    flight_id = str(flight_id).upper()
    
    try:
        result = []
        
        # PRIMARY SOURCE: Firebase refund_requests/{airport}/{flight}
        # Structure: refund_requests/DEL/QR621/{push_id}/{data}
        try:
            rref = safe_ref(f"refund_requests/{airport_code}/{flight_id}")
            rdata = rref.get() or {}
            app.logger.info("📦 Firebase data for %s/%s: %s", airport_code, flight_id, rdata)
            
            if isinstance(rdata, dict):
                for push_id, details in rdata.items():
                    # Direct structure: push_id -> {amount, name, pnr, reason, status, timestamp, upi_id}
                    if isinstance(details, dict):
                        result.append({
                            "passenger_id": str(push_id),
                            "name": details.get("name", "Unknown"),
                            "pnr": details.get("pnr") or push_id,
                            "amount": details.get("amount", 0),
                            "upi_id": details.get("upi_id", ""),
                            "reason": details.get("reason", "Refund request"),
                            "status": details.get("status", "pending"),
                            "timestamp": details.get("timestamp")
                        })
        except Exception as fb_exc:
            app.logger.exception("Firebase read failed: %s", fb_exc)

        # LOCAL FALLBACK
        if not result:
            local = _read_local_refunds()
            flight_map = local.get(airport_code, {}).get(flight_id, {}) if isinstance(local, dict) else {}
            for pax_id, details in (flight_map.items() if isinstance(flight_map, dict) else []):
                result.append({
                    "passenger_id": str(pax_id),
                    "name": details.get("name", "Unknown"),
                    "pnr": details.get("pnr") or pax_id,
                    "amount": details.get("amount", 0),
                    "upi_id": details.get("upi_id", ""),
                    "reason": details.get("reason", "Refund request"),
                    "status": details.get("status", "pending"),
                    "timestamp": details.get("timestamp")
                })

        result.sort(key=lambda x: (x.get("passenger_id") or ""))
        app.logger.info("✅ Returning %d refund requests", len(result))
        
        return add_cors_headers(jsonify(result)), 200
        
    except Exception as e:
        app.logger.exception("get_refund_requests_by_flight error: %s", e)
        return add_cors_headers(jsonify({"error": str(e)})), 500

# Route 3: Finalize/delete a refund request
@app.route("/api/refunds/<airport_code>/<flight_id>/<passenger_id>", methods=["DELETE", "OPTIONS"], strict_slashes=False)
@app.route("/api/refund_requests/<airport_code>/<flight_id>/<passenger_id>", methods=["DELETE", "OPTIONS"], strict_slashes=False)
def finalize_refund_request(airport_code, flight_id, passenger_id):
    if request.method == "OPTIONS":
        res = make_response("", 200)
        return add_cors_headers(res)
    
    try:
        airport = airport_code.upper()
        flight = flight_id.upper()
        pax = passenger_id
        
        # Delete the refund request from Firebase
        path = f"refund_requests/{airport}/{flight}/{pax}"
        ref = safe_ref(path)
        ref.delete()
        
        app.logger.info(f"✅ Finalized and deleted refund at {path}")
        return add_cors_headers(jsonify({"ok": True, "message": "Refund processed"})), 200
        
    except Exception as e:
        app.logger.exception(f"❌ finalize_refund error: {e}")
        return add_cors_headers(jsonify({"error": str(e)})), 500

# --- Helpers: flight record access and notifications (Realtime DB fallback) ---
def get_flight_record(airport: str, flight_id: str):
    """
    Return flight record dict from Realtime DB (or None).
    """
    try:
        root = get_database()
        rec = root.child("airports").child(airport).child("flights").child(flight_id).get()
        return rec or None
    except Exception as e:
        print("Error fetching flight record:", e)
        return None

def send_notifications_to_passengers(flight_obj: dict, message: str, ntype: str = "UPDATE"):
    """
    Write notification(s) to the Realtime DB under /notifications/<PNR>.
    flight_obj: flight record expected to contain a 'passengers' mapping (pnr -> passengerObj).
    """
    try:
        root = get_database()
        passengers = {}
        if isinstance(flight_obj, dict):
            passengers = flight_obj.get("passengers") or {}
        # passengers expected as dict pnrs -> info
        now_iso = datetime.utcnow().isoformat()
        for pnr, pinfo in (passengers.items() if isinstance(passengers, dict) else []):
            notif = {
                "title": f"Flight {flight_obj.get('flight_number', flight_obj.get('id', 'Flight'))} Update",
                "message": message,
                "type": ntype,
                "timestamp": now_iso
            }
            try:
                root.child("notifications").child(pnr.upper()).push(notif)
            except Exception as e:
                print(f"Failed to push notification for PNR {pnr}: {e}")
    except Exception as ex:
        print("send_notifications_to_passengers error:", ex)

# Example: make your existing flight routes accept both /flights/<airport>/<id> and /flights/<airport>/<id>.json
# merge with your real handler logic:
@app.route('/flights/<airport>/<flight_id>', methods=['GET','PATCH','DELETE','POST'])
@app.route('/flights/<airport>/<flight_id>.json', methods=['GET','PATCH','DELETE','POST'])
def flight_item(airport, flight_id):
    # normalize id (strip .json if present)
    clean_id = flight_id.replace('.json', '')
    root = get_database()
    if request.method == 'GET':
        # return flight record if exists
        flight = get_flight_record(airport, clean_id)
        if not flight:
            return jsonify({"ok": False, "error": "Flight not found"}), 404
        # attach id and source for frontend convenience
        flight_resp = {"id": clean_id, **(flight if isinstance(flight, dict) else {})}
        return jsonify({"ok": True, "data": flight_resp}), 200

    if request.method == 'PATCH':
        data = request.get_json(silent=True) or {}
        # apply updates to Realtime DB flight node
        try:
            flight_ref = root.child("airports").child(airport).child("flights").child(clean_id)
            existing = flight_ref.get() or {}
            # sanitize update keys (allow dep_time, status, etc.)
            updates = {}
            allowed = {"dep_time", "status", "arrival_time", "delay", "flight_number"}
            for k, v in data.items():
                if k in allowed or k.startswith("custom_"):
                    updates[k] = v
            if updates:
                flight_ref.update(updates)
            # notify passengers if requested
            if data.get("notifyPassengers"):
                # fetch updated flight (after applying updates)
                flight = get_flight_record(airport, clean_id) or {"id": clean_id, "flight_number": data.get("flight_number", clean_id), "source": airport}
                status = data.get("status", "Updated")
                delay = data.get("delay")
                dep_time = data.get("dep_time")
                parts = []
                if status:
                    parts.append(status)
                if delay:
                    parts.append(f"Delay: {delay}")
                if dep_time:
                    parts.append(f"New departure: {dep_time}")
                message = " · ".join(parts) or "Flight update"
                send_notifications_to_passengers(flight, message, ntype=(status or "UPDATE"))
            return jsonify({"ok": True}), 200
        except Exception as e:
            traceback.print_exc()
            return jsonify({"ok": False, "error": str(e)}), 500

    if request.method == 'DELETE':
        try:
            flight_ref = root.child("airports").child(airport).child("flights").child(clean_id)
            flight_data = flight_ref.get()
            if not flight_data:
                return jsonify({"ok": False, "error": "Flight not found"}), 404
            # archive and delete similar to cancel_flight behavior (lightweight)
            archive = {**flight_data, "cancelled_at": datetime.utcnow().isoformat()}
            root.child("cancelled_flights").child(clean_id).set(archive)
            flight_ref.delete()
            # notify passengers about cancellation
            send_notifications_to_passengers(archive, f"Flight {archive.get('flight_number', clean_id)} has been cancelled.", ntype="CANCELLED")
            return jsonify({"ok": True}), 200
        except Exception as e:
            traceback.print_exc()
            return jsonify({"ok": False, "error": str(e)}), 500

    return jsonify({"ok": False, "error": "Method not allowed"}), 405

from flask import make_response

# Helper to add CORS to any response
def add_cors(res):
    res.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    res.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    res.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    res.headers["Access-Control-Allow-Credentials"] = "true"
    return res

@app.route("/api/refunds/submit", methods=["POST", "OPTIONS"])
def submit_refund():
    if request.method == "OPTIONS":
        return add_cors(make_response("", 200))
    
    try:
        payload = request.get_json(force=True)
        airport = (payload.get("airport_code") or "").upper()
        flight = (payload.get("flight_id") or "").upper()
        pax = (payload.get("passenger_id") or "").upper()

        if not all([airport, flight, pax]):
            return add_cors(jsonify({"error": "Missing fields"})), 400

        data = {
            "name": payload.get("name", ""),
            "pnr": payload.get("pnr", pax),
            "upi_id": payload.get("upi_id", ""),
            "amount": payload.get("amount", 0),
            "status": "pending",
            "timestamp": int(time.time() * 1000),
        }

        # Saving to Airport/Flight/PNR to match your new structure
        ref = safe_ref(f"refund_requests/{airport}/{flight}/{pax}")
        ref.set(data)
        
        return add_cors(jsonify({"ok": True})), 201
    except Exception as e:
        return add_cors(jsonify({"error": str(e)})), 500

# NOTE: Duplicate route removed - using get_refund_requests_by_flight at line 522 instead

# --- MAIN EXECUTION ---
# if __name__ == "__main__":
    # port = int(os.environ.get("PORT", 5000))
    # host = "0.0.0.0"
    # app.run(host=host, port=port, debug=True)