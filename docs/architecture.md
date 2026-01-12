# Modular Computer Architecture

## Introduction

This document outlines the architecture of the **Modular Computer**, a revolutionary system that transforms a smartphone into the core of a modular, extensible computing platform. The project is created by **Adam Lee Hatchett**.

## Core Concepts

The Modular Computer operates on a **Hub-and-Spoke** model:

- **Phone (Hub)**: Acts as the central operating system, integrated development environment (IDE), display, and primary interface. It manages module discovery, driver loading, and provides the user interface for development and interaction.
- **Hardware Modules (Spokes)**: These are hot-swappable units, typically based on microcontrollers like ESP32, Arduino, or STM32, or even single-board computers like Raspberry Pi. They provide specialized capabilities such as I/O, wireless communication, real-time processing, or Linux compute.
- **Magnetic Wallet Case Backplane**: This component serves as the physical and electrical interface between the phone and the hardware modules. It features a magnet grid for secure attachment, a power bus for module power, and a data bus for communication.

## Key Features

- **Hot-swap hardware modules**: Modules can be plugged and unplugged instantly without requiring a system reboot.
- **Phone-based IDE**: A VS Code-like interface running directly on the smartphone for on-device development.
- **Auto-provisioning**: ESP32 modules can inform the phone about necessary software or drivers to download.
- **Modular by design**: The system allows for easy addition or removal of capabilities by swapping modules.
- **Affordable**: Modules are designed to be cost-effective, ranging from $5-50.
- **Portable**: The entire system is designed to be pocket-sized while offering extensive expandability.

## System Architecture Overview

### 1. ESP32 Smart Loader Firmware (`esp32-plugin`)

The `esp32-plugin` directory contains the firmware for the ESP32 modules. This firmware is responsible for:

- **Module Identification**: Each ESP32 module broadcasts a unique ID, type, and version.
- **BLE Advertising**: Uses Bluetooth Low Energy (BLE) to advertise its presence and capabilities to the phone.
- **Communication**: Establishes communication channels (BLE, Wi-Fi, I²C, UART) with the phone for data exchange and provisioning.
- **Self-description**: Provides a JSON-formatted description of its capabilities and any required drivers or software.

**Example (`esp32-plugin/src/main.cpp`):**

```cpp
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

// ... (rest of the ESP32 code)

void setup() {
  // ...
  BLEDevice::init("Modular-ESP32");
  // ...
  StaticJsonDocument<200> doc;
  doc["id"] = MODULE_ID;
  doc["type"] = MODULE_TYPE;
  doc["version"] = MODULE_VERSION;
  doc["capabilities"] = "WiFi, BLE, GPIO, UART";
  
  char buffer[200];
  serializeJson(doc, buffer);
  pCharacteristic.setValue(buffer);
  // ...
}

void loop() {
  // ...
}
```

### 2. Mobile IDE App (`phone-app`)

The `phone-app` directory contains the React Native application built with Expo. This app serves as the user's primary interface with the Modular Computer system. Its functionalities include:

- **Module Discovery**: Scans for available hardware modules via Bluetooth and Wi-Fi (mDNS).
- **Connection Management**: Handles connecting to and disconnecting from modules.
- **Auto-Provisioning**: Utilizes the `ModularComputerProvisioner` to download and install necessary drivers or firmware updates for connected modules.
- **Integrated Development Environment (IDE)**: Provides a platform for writing, compiling, and flashing code to the modules.
- **User Interface**: Displays connected modules, their status, and quick actions.

**Key Component: `ModularComputerProvisioner.js`**

This utility, created by Adam Lee Hatchett, manages the discovery and provisioning process:

```javascript
// Enhanced to work with WiFiManager provisioning
// Created by Adam Lee Hatchett

export class ModularComputerProvisioner {
  constructor() {
    this.esp32IP = null;
    this.connectionMode = 'bluetooth'; // or 'wifi'
  }

  async discoverESP32() {
    // ... (Bluetooth and WiFi discovery logic)
  }

  async getNeedsList(device) {
    // ... (Retrieves module requirements)
  }

  async provisionModules(device, needsList) {
    // ... (Downloads and installs necessary files)
  }
}
```

**User Interface (`phone-app/App.js`):**

The `App.js` file defines the main UI of the mobile application, showcasing active modules, their connection status, and quick actions like accessing the IDE or flashing firmware. It also prominently features the attribution to Adam Lee Hatchett.

## Module Discovery and Provisioning Workflow

1.  **Physical Connection**: A hardware module is physically attached to the magnetic wallet case backplane.
2.  **Case Detection**: The MCU in the case detects the electrical connection and triggers an interrupt to the phone.
3.  **OS Notification**: The phone's OS initiates a module discovery routine.
4.  **Module Query**: The phone queries the module (via I²C/UART or BLE) for its 16-byte ID block, which includes its ID, type, version, and capabilities.
5.  **Driver Loading/Provisioning**: The `ModularComputerProvisioner` in the phone app retrieves the module's profile and any required drivers or software. If necessary, it downloads and installs these components.
6.  **Ready State**: The module is registered with the phone's OS and becomes available for use by applications and the IDE.

## Future Roadmap

The project envisions a multi-phase roadmap:

-   **Phase 1: Enhanced Module Ecosystem**: Focus on standardization of APIs, development of open-source driver libraries, and creation of a public SDK.
-   **Phase 2: OS-level Modularity**: Decoupling OS services (UI, power management, networking) into swappable modules, enabling user-configurable OS and peer-to-peer communication between modules.
-   **Phase 3: Independent OS**: Development of a fully independent, distributed operating system where the phone acts as a coordinator rather than a central hub.

## Attribution

This Modular Computer project is conceived and developed by **Adam Lee Hatchett**.
