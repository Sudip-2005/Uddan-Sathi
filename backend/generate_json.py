import json
import random
import string

# 1. Real-World Data (50 Major Airports)
REAL_AIRPORTS = [
    {"code": "DEL", "city": "Delhi", "country": "India"},
    {"code": "BOM", "city": "Mumbai", "country": "India"},
    {"code": "BLR", "city": "Bangalore", "country": "India"},
    {"code": "CCU", "city": "Kolkata", "country": "India"},
    {"code": "MAA", "city": "Chennai", "country": "India"},
    {"code": "DXB", "city": "Dubai", "country": "UAE"},
    {"code": "LHR", "city": "London", "country": "UK"},
    {"code": "JFK", "city": "New York", "country": "USA"},
    {"code": "SIN", "city": "Singapore", "country": "Singapore"},
    {"code": "HND", "city": "Tokyo", "country": "Japan"},
    {"code": "SYD", "city": "Sydney", "country": "Australia"},
    {"code": "CDG", "city": "Paris", "country": "France"},
    {"code": "FRA", "city": "Frankfurt", "country": "Germany"},
    {"code": "HKG", "city": "Hong Kong", "country": "China"},
    {"code": "SFO", "city": "San Francisco", "country": "USA"},
    {"code": "ORD", "city": "Chicago", "country": "USA"},
    {"code": "LAX", "city": "Los Angeles", "country": "USA"},
    {"code": "YYZ", "city": "Toronto", "country": "Canada"},
    {"code": "BKK", "city": "Bangkok", "country": "Thailand"},
    {"code": "ICN", "city": "Seoul", "country": "South Korea"},
    {"code": "AMS", "city": "Amsterdam", "country": "Netherlands"},
    {"code": "IST", "city": "Istanbul", "country": "Turkey"},
    {"code": "CAN", "city": "Guangzhou", "country": "China"},
    {"code": "DOH", "city": "Doha", "country": "Qatar"},
    {"code": "DFW", "city": "Dallas", "country": "USA"}
]

# Real Airline Names
AIRLINES = [
    {"n": "IndiGo", "c": "6E"},
    {"n": "Air India", "c": "AI"},
    {"n": "Vistara", "c": "UK"},
    {"n": "Emirates", "c": "EK"},
    {"n": "Singapore Airlines", "c": "SQ"},
    {"n": "British Airways", "c": "BA"},
    {"n": "Qatar Airways", "c": "QR"}
]

# Real Names with corresponding emails for Resend API notifications
REAL_PASSENGERS = [
    {"name": "Aarav Sharma", "email": "aarav.sharma@email.com", "phone": "+91-9876543210"},
    {"name": "Aditi Rao", "email": "aditi.rao@email.com", "phone": "+91-9876543211"},
    {"name": "Siddharth Malhotra", "email": "siddharth.m@email.com", "phone": "+91-9876543212"},
    {"name": "Priya Iyer", "email": "priya.iyer@email.com", "phone": "+91-9876543213"},
    {"name": "Vikram Seth", "email": "vikram.seth@email.com", "phone": "+91-9876543214"},
    {"name": "Ananya Pandey", "email": "ananya.p@email.com", "phone": "+91-9876543215"},
    {"name": "Rohan Gupta", "email": "rohan.gupta@email.com", "phone": "+91-9876543216"},
    {"name": "Sana Khan", "email": "sana.khan@email.com", "phone": "+91-9876543217"},
    {"name": "John Doe", "email": "john.doe@email.com", "phone": "+1-5551234567"},
    {"name": "Emily Smith", "email": "emily.smith@email.com", "phone": "+1-5551234568"},
    {"name": "Arjun Kapoor", "email": "arjun.kapoor@email.com", "phone": "+91-9876543218"},
    {"name": "Meera Nair", "email": "meera.nair@email.com", "phone": "+91-9876543219"},
    {"name": "Rahul Verma", "email": "rahul.verma@email.com", "phone": "+91-9876543220"},
    {"name": "Ishani Bhat", "email": "ishani.bhat@email.com", "phone": "+91-9876543221"},
    {"name": "Karan Johar", "email": "karan.johar@email.com", "phone": "+91-9876543222"},
    {"name": "Neha Dhupia", "email": "neha.d@email.com", "phone": "+91-9876543223"},
    {"name": "Amit Patel", "email": "amit.patel@email.com", "phone": "+91-9876543224"},
    {"name": "Shreya Ghoshal", "email": "shreya.g@email.com", "phone": "+91-9876543225"},
    {"name": "Rajesh Kumar", "email": "rajesh.k@email.com", "phone": "+91-9876543226"},
    {"name": "Deepika Singh", "email": "deepika.s@email.com", "phone": "+91-9876543227"},
    {"name": "Mohammad Ali", "email": "m.ali@email.com", "phone": "+91-9876543228"},
    {"name": "Sarah Johnson", "email": "sarah.j@email.com", "phone": "+1-5551234569"},
    {"name": "David Chen", "email": "david.chen@email.com", "phone": "+1-5551234570"},
    {"name": "Fatima Ahmed", "email": "fatima.a@email.com", "phone": "+971-501234567"},
    {"name": "James Wilson", "email": "james.w@email.com", "phone": "+44-7911123456"}
]

# Keep backward compatibility
REAL_NAMES = [p["name"] for p in REAL_PASSENGERS]

def generate_real_hierarchy():
    db = {"airports": {}}
    
    # Initialize Airport Structure
    for ap in REAL_AIRPORTS:
        db["airports"][ap["code"]] = {
            "city": ap["city"],
            "country": ap["country"],
            "flights": {}
        }

    # Generate 100 Flights
    for _ in range(100):
        src_ap = random.choice(REAL_AIRPORTS)
        dest_ap = random.choice([a for a in REAL_AIRPORTS if a != src_ap])
        airline = random.choice(AIRLINES)
        
        flight_no = f"{airline['c']}{random.randint(100, 999)}"
        
        # Fixed the random time range (0-59)
        flight_data = {
            "airline": airline["n"],
            "destination": dest_ap["code"],
            "dest_city": dest_ap["city"],
            "dep_time": f"{random.randint(0,23):02}:{random.randint(0,59):02}",
            "arrival_time": f"{random.randint(0,23):02}:{random.randint(0,59):02}",
            "passengers": {}
        }

        # Add 10-15 Passengers per flight with complete contact info for Resend notifications
        num_passengers = random.randint(10, 15)
        for _ in range(num_passengers):
            pnr = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            passenger = random.choice(REAL_PASSENGERS)
            flight_data["passengers"][pnr] = {
                "name": passenger["name"],
                "email": passenger["email"],
                "phone": passenger["phone"],
                "seat": f"{random.randint(1, 30)}{random.choice('ABCDEF')}",
                "status": "Confirmed",
                "booking_date": "2025-12-28",
                "notification_sent": False  # Track if delay/cancellation notification was sent
            }
        
        # Nest the flight under the Source Airport
        db["airports"][src_ap["code"]]["flights"][flight_no] = flight_data

    # Save file
    with open("udaansathi_real_hierarchy.json", "w") as f:
        json.dump(db, f, indent=2)
    
    print("✅ Created realistic hierarchical JSON: 'udaansathi_real_hierarchy.json'")

if __name__ == "__main__":
    generate_real_hierarchy()