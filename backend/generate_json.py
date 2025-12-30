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

# Real Names to avoid "Passenger 1"
REAL_NAMES = ["Aarav Sharma", "Aditi Rao", "Siddharth Malhotra", "Priya Iyer", "Vikram Seth", 
              "Ananya Pandey", "Rohan Gupta", "Sana Khan", "John Doe", "Emily Smith", 
              "Arjun Kapoor", "Meera Nair", "Rahul Verma", "Ishani Bhat", "Karan Johar"]

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

        # Add 10 Passengers per flight
        for _ in range(10):
            pnr = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            flight_data["passengers"][pnr] = {
                "name": random.choice(REAL_NAMES),
                "seat": f"{random.randint(1, 30)}{random.choice('ABCDEF')}",
                "status": "Confirmed",
                "booking_date": "2025-12-28"
            }
        
        # Nest the flight under the Source Airport
        db["airports"][src_ap["code"]]["flights"][flight_no] = flight_data

    # Save file
    with open("udaansathi_real_hierarchy.json", "w") as f:
        json.dump(db, f, indent=2)
    
    print("✅ Created realistic hierarchical JSON: 'udaansathi_real_hierarchy.json'")

if __name__ == "__main__":
    generate_real_hierarchy()