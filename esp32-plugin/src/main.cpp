#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

// Module Configuration
#define MODULE_ID "ESP32-CORE-001"
#define MODULE_TYPE "COMPUTE"
#define MODULE_VERSION "1.0.0"

// BLE UUIDs
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();
      if (value.length() > 0) {
        Serial.println("*********");
        Serial.print("New value: ");
        for (int i = 0; i < value.length(); i++)
          Serial.print(value[i]);
        Serial.println();
        Serial.println("*********");
      }
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting Modular Computer Smart Loader...");

  // Initialize BLE
  BLEDevice::init("Modular-ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristic->setCallbacks(new MyCallbacks());
  
  // Set initial module info
  StaticJsonDocument<200> doc;
  doc["id"] = MODULE_ID;
  doc["type"] = MODULE_TYPE;
  doc["version"] = MODULE_VERSION;
  doc["capabilities"] = "WiFi, BLE, GPIO, UART";
  
  char buffer[200];
  serializeJson(doc, buffer);
  pCharacteristic->setValue(buffer);
  
  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  
  Serial.println("Module is ready and advertising.");
}

void loop() {
  // Handle hot-swap logic or periodic tasks here
  delay(2000);
}
