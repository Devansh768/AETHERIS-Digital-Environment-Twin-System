# Week 6: 2.5D Cybernetic Grid, GPS Capture & Startup Data Seeding (August 10 – August 16, 2026)
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 6 united canvas graphics with backend persistence and client geolocation: rendering the 2.5D cybernetic isometric terrain grid with pulsing beacon nodes, building responsive dashboard viewports, integrating the W3C browser Geolocation API, establishing time-series query pagination, and engineering `DataInitializer.java` to seed 6 default monitoring stations, historical telemetry, and demo credentials on server launch.

---

### 📋 Team Members

| Name | Enrollment | Email | Mobile |
| :--- | :--- | :--- | :--- |
| **Devansh Joshi** | 24E1ARADM40P039 | devanshjoshi980@gmail.com | 7597934912 |
| **Devansh Mittal** | 24E1ARADM40P041 | devanshmittal308@gmail.com | 6375536662 |
| **Dhruv Jain** | 24E1ARADM40P043 | dhruvtorawat5555@gmail.com | 8239361149 |
| **Garv Kumar** | 24E1ARADM40P049 | garvmittal94068@gmail.com | 7412894068 |
| **Ishita Sinha** | 24E1ARADF40P063 | ishsinha1106@gmail.com | 9241970138 |

---

## 👥 Member-Wise Breakdown & Tasks

### 1. Ishita Sinha
* **Role / Domain:** Frontend Canvas & Computer Graphics
* **Core Focus:** 2.5D Isometric Cybernetic Grid & Glowing Sensor Beacons
* **Weekly Tasks:**
  * Programmed the isometric cybernetic background grid with perspective lines on the HTML5 Canvas.
  * Created glowing beacon graphics for monitoring sensor nodes (`NODE-01` to `NODE-06`) on their projected $(X, Y)$ screen coordinates.
  * Added animated pulsing radar rings around active sensor nodes with expanding radial alpha decay.
* **Key Deliverable:** Animated 2.5D Cybernetic Grid & Sensor Beacons.

---

### 2. Dhruv Jain
* **Role / Domain:** Frontend UI/UX & Web Dashboard
* **Core Focus:** Responsive Grid Layout & Top Navbar Indicators
* **Weekly Tasks:**
  * Built responsive CSS Grid and Flexbox layouts adapting cleanly across ultra-wide monitors, laptops, and tablets.
  * Added CSS media queries ensuring telemetry cards stack vertically on smaller viewports without horizontal scrolling.
  * Integrated the live header clock widget and real-time network connectivity status indicator in the top navbar.
* **Key Deliverable:** Responsive Multi-Device Dashboard Layout.

---

### 3. Devansh Joshi
* **Role / Domain:** Backend Services & Geospatial Algorithms
* **Core Focus:** Browser Geolocation API Integration & Fallback Handlers
* **Weekly Tasks:**
  * Implemented client-side GPS coordinate retrieval in `frontend/js/location.js` using `navigator.geolocation.getCurrentPosition()`.
  * Configured high-accuracy GPS options with custom timeout intervals.
  * Built fallback handlers for permission denial (`PERMISSION_DENIED`), position unavailability, and environments without GPS hardware.
* **Key Deliverable:** Robust Browser Geolocation Capture Service.

---

### 4. Devansh Mittal
* **Role / Domain:** Backend Simulation & Automated Alerting
* **Core Focus:** Time-Series Repository Persistence & History Retrieval
* **Weekly Tasks:**
  * Connected generated telemetry ticks to `TelemetryRecordRepository` for automated persistent storage.
  * Built service methods to fetch the latest live telemetry across all active stations (`getLatestTelemetry()`).
  * Implemented historical query pagination (`getStationHistory()`) limiting retrieval to the latest 100 entries per station node.
* **Key Deliverable:** Real-Time Telemetry Persistence & History Query Service.

---

### 5. Garv Kumar
* **Role / Domain:** Database Architecture & Application
* **Core Focus:** Startup Data Seeding & Zero-Config Database Initializer
* **Weekly Tasks:**
  * Built `DataInitializer.java` to automatically seed 6 default monitoring stations (`NODE-01` to `NODE-06`) on application startup.
  * Seeded initial sensor history and default demo credentials (`admin` / `admin123`, `operator` / `operator123`).
  * Ensured zero-config database startup so the platform runs out-of-the-box on MySQL or in-memory H2.
* **Key Deliverable:** Zero-Config Database Startup & Auto-Seeding Service.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Animated 2.5D Cybernetic Grid & Beacons | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Responsive Multi-Device Dashboard Layout | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Robust Browser Geolocation Capture Service | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Telemetry Persistence & History Query Service | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | Zero-Config Database Startup & Auto-Seeder | ✅ Completed |

---

## 🖼️ User Interface (UI) Mock-up: Device Location Pairing Radar

### Device Geographic Location Pairing Modal
*Features real-time GPS/IP coordinate auto-detection, a pulsing animated radar sweep graphic, state/territory dropdown selector, preset environmental monitoring zones, and manual coordinate input:*

* [AETHERIS Device Location Pairing Modal]![Device Location Pairing Radar](./images/week6_location_pairing.png)

