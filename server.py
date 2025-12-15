from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime
from twilio.rest import Client
import threading
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='Frontend/dist', static_url_path='')

# -----------------------------
# Twilio Configuration
# -----------------------------
ACCOUNT_SID = "AC1ae2e5ce8d11254029564d16f8b54476"
AUTH_TOKEN = "0f3d7e6315ecfccaf2c9d9ea11ac6c06"
TWILIO_NUMBER = "+918446551285"      # your Twilio number from console
EMERGENCY_NUMBER = "+917385339826"  # your verified phone number

client = Client(ACCOUNT_SID, AUTH_TOKEN)

# -----------------------------
# System State Variables
# -----------------------------
state = {
    "wear": "unknown",
    "hr": None,
    "spo2": None,
    "crashStatus": "normal",  # normal, pending, falseAlert, trueCrash
    "crashActivity": [],
    "logs": []
}

lock = threading.Lock()

# -----------------------------
# Serve React App
# -----------------------------
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


# -----------------------------
# ESP32 → Flask Updates
# -----------------------------
@app.route('/update', methods=['POST'])
def update():
    """ESP32 sends live biometric & status updates here"""
    data = request.form.to_dict()
    now = datetime.now().strftime("%H:%M:%S")

    with lock:
        t = data.get("type")
        if t == "biometric":
            state["hr"] = data.get("hr")
            state["spo2"] = data.get("spo2")
        elif t == "status":
            state["wear"] = data.get("wear")
        elif t == "crash":
            state["crashStatus"] = "pending"
        elif t == "cancel":
            state["crashStatus"] = "falseAlert"
        elif t == "finalCrash":
            state["crashStatus"] = "trueCrash"
            crash_entry = {
                "time": now,
                "wear": data.get("wear"),
                "hr": data.get("hr"),
                "spo2": data.get("spo2"),
                "status": "True Crash"
            }
            state["crashActivity"].insert(0, crash_entry)

        state["logs"].insert(0, f"[{now}] {data}")

    return "OK"


# -----------------------------
# React Dashboard → Flask (GET live status)
# -----------------------------
@app.route('/status')
def status():
    """Frontend polls this endpoint"""
    with lock:
        return jsonify(state)


# -----------------------------
# React → Flask (Send Emergency SMS)
# -----------------------------
@app.route('/api/emergency', methods=['POST'])
def emergency():
    """Send SMS via Twilio when crash occurs"""
    data = request.get_json()
    hr = data.get("hr", "N/A")
    spo2 = data.get("spo2", "N/A")
    wear = data.get("wear", "N/A")
    status = data.get("status", "N/A")
    location = data.get("location", "Unknown")

    message_body = f"""
🚨 Smart Helmet Crash Alert 🚨
Time: {datetime.now().strftime("%H:%M:%S")}
Heart Rate: {hr} bpm
SpO₂: {spo2}%
Helmet Status: {wear}
Crash Status: {status}
Location: {location}
"""

    try:
        message = client.messages.create(
            from_=TWILIO_NUMBER,
            to=EMERGENCY_NUMBER,
            body=message_body
        )
        print(f"✅ SMS sent successfully! SID: {message.sid}")
        return jsonify({"status": "success", "sid": message.sid})
    except Exception as e:
        print(f"❌ Error sending SMS: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    print("🚀 Smart Helmet Flask Server running at http://0.0.0.0:8080")
    app.run(host="0.0.0.0", port=8080, debug=True)
