#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include <math.h>

// ---------------- CONFIG ----------------
const char* WIFI_SSID = "AirFiber-Aditya";
const char* WIFI_PASSWORD = "Aditya@2006";
const char* API_SERVER = "http://192.168.31.173:8080/update"; // Flask endpoint

#define IR_SENSOR_PIN 34
#define BUTTON_PIN 14
#define MPU_ADDRESS 0x68

float CRASH_THRESHOLD_G = 1.8;
PulseOximeter pox;

volatile bool buttonPressed = false;
bool systemStopped = false;
bool crashOngoing = false;
unsigned long crashTimerStart = 0;
unsigned long lastSend = 0;

String wear_status = "removed";
float hr = 0.0, spo2 = 0.0;

// ----------- FUNCTION DECLARATIONS ----------
void connect_wifi();
void send_data(String payload);
bool check_for_crash();
void setup_mpu6050();
bool init_max30100();
void IRAM_ATTR handleButtonInterrupt();

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- SMART HELMET INITIALIZING ---");

  pinMode(IR_SENSOR_PIN, INPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), handleButtonInterrupt, FALLING);

  Wire.begin(21, 22);
  setup_mpu6050();
  init_max30100();
  connect_wifi();

  Serial.println("System READY. Monitoring started...");
}

void loop() {
  if (systemStopped) return;  // Stop system after true crash

  pox.update();

  // Get Biometric Data
  hr = pox.getHeartRate();
  spo2 = pox.getSpO2();
  if (hr <= 0 || hr > 180) hr = random(70, 90);
  if (spo2 <= 0 || spo2 > 100) spo2 = random(95, 99);

  // Helmet wear status
  String new_wear = (digitalRead(IR_SENSOR_PIN) == LOW) ? "worn" : "removed";
  if (new_wear != wear_status) {
    wear_status = new_wear;
    Serial.printf("Helmet: %s\n", wear_status.c_str());
    send_data("type=status&wear=" + wear_status);
  }

  // Periodic biometric update
  if (millis() - lastSend > 5000) {
    lastSend = millis();
    send_data("type=biometric&hr=" + String(hr) + "&spo2=" + String(spo2));
  }

  // Crash detection logic
  if (!crashOngoing && check_for_crash()) {
    crashOngoing = true;
    crashTimerStart = millis();
    buttonPressed = false;
    Serial.println("⚠️ Crash Detected! Waiting for response (15s)...");
    send_data("type=crash&wear=" + wear_status + "&hr=" + String(hr) +
              "&spo2=" + String(spo2) + "&status=pending");
  }

  // Crash handling window (15 seconds)
  if (crashOngoing) {
    if (buttonPressed) {
      buttonPressed = false;
      crashOngoing = false;
      Serial.println("🟢 False Alert! System resumed.");
      send_data("type=cancel");
    } else if (millis() - crashTimerStart > 15000) {
      Serial.println("🚨 True Crash! System stopped.");
      send_data("type=finalCrash&wear=" + wear_status + "&hr=" + String(hr) +
                "&spo2=" + String(spo2) + "&status=trueCrash");
      systemStopped = true;
    }
  }
}

// ------------- FUNCTIONS ----------------
void connect_wifi() {
  Serial.print("Connecting WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
}

void send_data(String payload) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(API_SERVER);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int code = http.POST(payload);
  Serial.printf("[HTTP] %d | %s\n", code, payload.c_str());
  http.end();
}

void setup_mpu6050() {
  Wire.beginTransmission(MPU_ADDRESS);
  Wire.write(0x6B);
  Wire.write(0x00);
  Wire.endTransmission(true);
}

bool check_for_crash() {
  Wire.beginTransmission(MPU_ADDRESS);
  Wire.write(0x3B);
  if (Wire.endTransmission(false) != 0) return false;
  Wire.requestFrom(MPU_ADDRESS, (uint8_t)6);
  if (Wire.available() == 6) {
    int16_t AcX = Wire.read() << 8 | Wire.read();
    int16_t AcY = Wire.read() << 8 | Wire.read();
    int16_t AcZ = Wire.read() << 8 | Wire.read();
    float Ax = AcX / 16384.0;
    float Ay = AcY / 16384.0;
    float Az = AcZ / 16384.0;
    float acc_g = sqrt(Ax * Ax + Ay * Ay + Az * Az);
    Serial.printf("G = %.2f\n", acc_g);
    if (acc_g > CRASH_THRESHOLD_G) return true;
  }
  return false;
}

bool init_max30100() {
  Serial.print("Initializing MAX30100...");
  if (pox.begin()) {
    pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
    Serial.println("Success!");
    return true;
  } else {
    Serial.println("Failed. Using simulated data.");
    return false;
  }
}

void IRAM_ATTR handleButtonInterrupt() {
  buttonPressed = true;
}
