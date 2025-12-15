
# 🪖 Smart Helmet – Real-Time Safety Monitoring System

**Smart Helmet** is an **IoT-based real-time safety monitoring system** designed to detect road accidents, monitor rider health, and automatically send emergency alerts.
It combines **embedded systems (ESP32)**, **backend services (Flask)**, and a **modern React dashboard** for live monitoring.

---

## 🚀 Features

### 🧠 Accident Detection

* Crash detection using **MPU6050 accelerometer**
* G-force based threshold detection
* **15-second false alert cancellation window**
* Automatic emergency escalation on true crash

### ❤️ Health Monitoring

* **Heart Rate** monitoring
* **SpO₂ (Blood Oxygen)** monitoring
* Real-time biometric updates
* Sensor fallback with simulated values (for stability)

### 👷 Helmet Safety

* IR sensor to detect **helmet worn / removed**
* Status reflected instantly on dashboard

### 🌐 Real-Time Dashboard

* Live helmet status
* Crash alerts with visual warning
* Event logs (biometric & crash events)
* Crash history activity panel
* Emergency alert notifications

### 📲 Emergency Alert System

* Emergency SMS sent via **Twilio**
* Includes:

  * Heart rate
  * SpO₂
  * Helmet status
  * Crash confirmation
  * Time of incident

---

## 🖼️ Project Screenshots

### 📊 Dashboard Overview

<img width="1669" height="1000" alt="Screenshot 2025-11-12 080007" src="https://github.com/user-attachments/assets/7c188606-804a-488d-ab81-8b1652aa2a7d" />

### 🚨 Crash Detection & Alert

<img width="1470" height="829" alt="Screenshot 2025-11-12 072912" src="https://github.com/user-attachments/assets/e58e091e-0ba3-4419-a4f2-226cc8ee4ecc" />

### 🧾 Event Logs & Crash History

<img width="843" height="503" alt="Screenshot 2025-11-12 085739" src="https://github.com/user-attachments/assets/e5f328f2-7626-490b-a2d0-a6d0f085e6b1" />

---

## 🧱 System Architecture

```
[ Sensors ]
   |  IR Sensor (Helmet)
   |  MAX30100 (HR & SpO₂)
   |  MPU6050 (Crash)
   |  Push Button (Cancel)
          |
        ESP32
          |
        WiFi (HTTP)
          |
       Flask Server
          |
      React Dashboard
          |
     Emergency SMS (Twilio)
```

---

## 🔌 Hardware Components

| Component          | Description                       |
| ------------------ | --------------------------------- |
| ESP32              | Main microcontroller with WiFi    |
| MPU6050            | Accelerometer for crash detection |
| MAX30100           | Heart rate & SpO₂ sensor          |
| IR Sensor          | Helmet wear detection             |
| Push Button        | False alert cancellation          |
| Breadboard & Wires | Prototyping                       |
| Power Supply       | USB / 5V                          |

---

## 🔗 Pin Connections (ESP32)

| Component     | ESP32 Pin |
| ------------- | --------- |
| MPU6050 SDA   | GPIO 21   |
| MPU6050 SCL   | GPIO 22   |
| MAX30100 SDA  | GPIO 21   |
| MAX30100 SCL  | GPIO 22   |
| IR Sensor OUT | GPIO 34   |
| Push Button   | GPIO 14   |
| VCC           | 3.3V      |
| GND           | GND       |

---

## 🔌 Circuit Diagram

<img width="1536" height="1024" alt="ChatGPT Image Dec 16, 2025, 02_50_24 AM" src="https://github.com/user-attachments/assets/1f484dd4-4894-49e4-9ed5-b6fd7c602f86" />


> Diagram follows the **exact connections used in code**

---

## 📁 Project Structure

```
SmartHelmet_Dashboard/
│
├── SmartHelmet.ino        # ESP32 firmware
├── server.py              # Flask backend
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── public/
│   └── dist/
│
├── assets/
│   ├── images/
│   └── circuit/
│
├── README.md
└── .gitignore
```

---

## ⚙️ How It Works

### 1️⃣ ESP32 (Helmet Unit)

* Reads:

  * Acceleration (MPU6050)
  * Heart Rate & SpO₂ (MAX30100)
  * Helmet wear status (IR sensor)
* Detects crash using resultant G-force
* Sends data to server using HTTP POST
* Allows false crash cancellation via button

### 2️⃣ Flask Backend

* Receives live data from ESP32
* Maintains system state
* Provides REST API for dashboard
* Sends emergency SMS using Twilio

### 3️⃣ React Dashboard

* Polls backend every second
* Displays real-time data
* Shows crash alerts and logs
* Triggers emergency alert UI

---

## 🛠️ Installation & Setup

### 🔧 ESP32 Setup

1. Open `SmartHelmet.ino` in Arduino IDE
2. Install required libraries:

   * WiFi
   * HTTPClient
   * MAX30100_PulseOximeter
3. Select **ESP32 board**
4. Update WiFi credentials
5. Upload code

---

### 🖥️ Backend (Flask)

```bash
pip install flask twilio python-dotenv
python server.py
```

Server runs at:

```
http://localhost:8080
```

---

### 🌐 Frontend (React)

```bash
cd Frontend
npm install
npm run dev
```

---

## 📲 Emergency Alert Sample

```
🚨 Smart Helmet Crash Alert 🚨
Time: 07:43:27
Heart Rate: 76 bpm
SpO₂: 98%
Helmet Status: Worn
Crash Status: True Crash
```

---

## 🔮 Future Enhancements

* GPS module for live location tracking
* Mobile app (Android / iOS)
* Cloud database integration
* AI-based crash classification
* Battery health monitoring
* Voice alert inside helmet

---

## 🏆 Why This Project Matters

* Solves a **real-world safety problem**
* Combines **IoT + Web + Backend**
* Scalable & industry-relevant
* Strong **academic & resume project**
* Suitable for **EDI / Mini / Major Project**

---

## 👨‍💻 Author
**Aditya Bhonde**

