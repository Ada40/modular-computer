# 🚀 Modular Computer

**The world's first modular portable computer** - use any hardware board as a hot-swappable plugin module for your phone!

## ✨ What This Is

Turn your phone into the core of a modular computer system where:
- **Phone** = Compute core + display + interface
- **ESP32/Arduino/STM32/Raspberry Pi** = Hot-swappable hardware modules
- **Generic hardware** = Specialized capabilities (I/O, wireless, real-time, Linux compute)

## 🎯 Key Features

- **🔌 Hot-swap hardware modules** (plug/unplug instantly)
- **📱 Phone-based IDE** (VS Code-like interface)
- **⚡ Auto-provisioning** (ESP32 tells phone what to download)
- **🔧 Modular by design** (add/remove capabilities)
- **💰 Affordable** ($5-50 per module vs $1000+ PC)
- **📦 Portable** (fits in pocket, expands to anything)

## 📂 Project Structure

- `esp32-plugin/`: Smart loader firmware for ESP32 modules.
- `phone-app/`: Mobile IDE app built with Expo/React Native.
- `modules/`: Hardware-specific module definitions and drivers.
- `docs/`: Detailed documentation and architectural guides.
- `examples/`: Example projects and use cases.

## 🚀 Quick Start

### 1. Flash ESP32 Once (Smart Loader)
```bash
cd esp32-plugin
platformio run --target upload
```

### 2. Run Phone App
```bash
cd phone-app
npm install
expo start
# Scan QR code with Expo Go app
```

## 🛠️ Architecture

The system uses a **Hub-and-Spoke** architecture where the phone acts as the central hub, and hardware modules are spokes connected via a magnetic backplane.

- **Communication**: I2C/UART for low-level, BLE/Wi-Fi for high-level data.
- **Power**: 5V/2A power bus from the phone battery.
- **Discovery**: Automatic module identification via a 16-byte ID block.

---
*Created by Adam Lee Hatchett © 2026*
