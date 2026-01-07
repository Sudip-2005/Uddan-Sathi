"""
Seed the Firebase Realtime Database with flight and passenger data.
Run this script after generating new JSON data with generate_json.py
"""

import json
import os
import firebase_admin
from firebase_admin import credentials, db

# Firebase Configuration
SERVICE_ACCOUNT_PATH = "serviceAccountKey.json"
DATABASE_URL = os.getenv("FIREBASE_DATABASE_URL", "https://udaansathi-2025-default-rtdb.firebaseio.com")  # Update this!

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        if os.path.exists(SERVICE_ACCOUNT_PATH):
            cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        else:
            # Use environment variable for credentials (for deployment)
            cred_json = os.getenv("FIREBASE_CREDENTIAL_JSON")
            if cred_json:
                cred_dict = json.loads(cred_json)
                cred = credentials.Certificate(cred_dict)
            else:
                raise Exception("No Firebase credentials found!")
        
        firebase_admin.initialize_app(cred, {"databaseURL": DATABASE_URL})
    
    return db.reference()

def seed_from_hierarchy_json():
    """
    Upload udaansathi_real_hierarchy.json to Firebase.
    This includes all flights with passengers, emails, and notification_sent flags.
    """
    root = initialize_firebase()
    
    with open("udaansathi_real_hierarchy.json", "r") as f:
        data = json.load(f)
    
    print("📤 Uploading hierarchical flight data to Firebase...")
    
    # Upload the entire airports structure
    root.child("airports").set(data["airports"])
    
    print(f"✅ Uploaded {len(data['airports'])} airports with flights and passengers!")
    
    # Count totals for verification
    total_flights = 0
    total_passengers = 0
    for airport_code, airport_data in data["airports"].items():
        flights = airport_data.get("flights", {})
        total_flights += len(flights)
        for flight_id, flight_data in flights.items():
            passengers = flight_data.get("passengers", {})
            total_passengers += len(passengers)
    
    print(f"📊 Total: {total_flights} flights, {total_passengers} passengers with email addresses")

def seed_from_initial_json():
    """
    Upload initial_flight_data.json to Firebase (alternative flat structure).
    This data also includes passengers with emails.
    """
    root = initialize_firebase()
    
    with open("initial_flight_data.json", "r") as f:
        data = json.load(f)
    
    print("📤 Uploading initial flight data to Firebase...")
    
    # Upload airlines reference
    if "airlines" in data:
        root.child("airlines").set(data["airlines"])
        print(f"  ✅ Uploaded {len(data['airlines'])} airlines")
    
    # Upload airports reference  
    if "airports" in data:
        root.child("airport_info").set(data["airports"])
        print(f"  ✅ Uploaded {len(data['airports'])} airport details")
    
    # Convert flat flights structure to hierarchical (by source airport)
    if "flights" in data:
        airports_hierarchy = {}
        for flight_id, flight_info in data["flights"].items():
            source = flight_info.get("source", "UNKNOWN")
            if source not in airports_hierarchy:
                airports_hierarchy[source] = {"flights": {}}
            airports_hierarchy[source]["flights"][flight_id] = flight_info
        
        # Merge with existing airport data
        for code, airport_data in airports_hierarchy.items():
            root.child("airports").child(code).child("flights").set(airport_data["flights"])
        
        total_passengers = sum(len(f.get("passengers", {})) for f in data["flights"].values())
        print(f"  ✅ Uploaded {len(data['flights'])} flights with {total_passengers} passengers")

def clear_database():
    """Clear all flight data (use with caution!)"""
    root = initialize_firebase()
    
    confirm = input("⚠️ This will DELETE all flight data! Type 'YES' to confirm: ")
    if confirm == "YES":
        root.child("airports").delete()
        root.child("cancelled_flights").delete()
        root.child("notifications").delete()
        print("🗑️ Database cleared!")
    else:
        print("❌ Cancelled")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--initial":
            seed_from_initial_json()
        elif sys.argv[1] == "--clear":
            clear_database()
        else:
            print("Usage: python seed_database.py [--initial|--clear]")
    else:
        # Default: use the hierarchy JSON
        seed_from_hierarchy_json()
