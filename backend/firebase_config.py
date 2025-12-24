import firebase_admin
from firebase_admin import credentials, db
import os
from dotenv import load_dotenv

# This tells Python to look for .env in the same folder as THIS file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)

def get_database():
    if not firebase_admin._apps:
        url = os.getenv("FIREBASE_DATABASE_URL")
        
        # DEBUG PRINTS - Check your terminal for these!
        print(f"--- DEBUG INFO ---")
        print(f"Looking for .env at: {env_path}")
        print(f"Loaded URL: {url}")
        print(f"------------------")

        if not url:
            raise ValueError("FIREBASE_DATABASE_URL not found in .env")

        try:
            KEY_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")
            cred = credentials.Certificate(KEY_PATH)
            firebase_admin.initialize_app(cred, {"databaseURL": url})
            print("✅ Firebase initialized successfully!")
        except Exception as e:
            print(f"❌ Initialization failed: {e}")
            raise e

    return db.reference("/")