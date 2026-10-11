# Week 8: Multi-Map Modes, GPS Dialog, Station CRUD & Automated Alerts (August 24 – August 30, 2026)
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 8 consolidated visual modes, geolocation modals, node management, and automated safety detection: programming the Thermal Heatmap and Radar Proximity modes in the canvas engine, constructing the "Device Location Pairing" radar modal dialog, exposing the complete Station CRUD REST controller, implementing real-time safety threshold rules for AQI ($\ge 250$) and Temperature ($\ge 38^\circ\text{C}$), and developing user registration and authentication business logic.

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
* **Core Focus:** Thermal Heatmap & Radar Proximity Canvas Modes
* **Weekly Tasks:**
  * Built the Thermal Heatmap Mode rendering multi-tier ambient temperature radial heat contours around active stations.
  * Built the Radar Proximity Mode rendering dynamic rotating radar sweep beams and pulsing sonar rings.
  * Implemented smooth cross-fading and state transitions when switching between the 3 visual digital twin modes.
* **Key Deliverable:** 3 Toggleable Visual Canvas Twin Modes.

---

### 2. Dhruv Jain
* **Role / Domain:** Frontend UI/UX & Web Dashboard
* **Core Focus:** GPS Location Pairing Modal UI & Preset Zone Chips
* **Weekly Tasks:**
  * Created the "App Location Enable" / "Device Location Pairing" popup dialog in `frontend/index.html`.
  * Built the animated pulsing radar sweep graphic and coordinates readout in `frontend/js/location.js`.
  * Added preset zone quick-chips (*Urban Core, Industrial Park, Botanical Reserve, Coastal Basin*) for users without active GPS sensors.
* **Key Deliverable:** GPS Location Pairing Modal Dialog UI.

---

### 3. Devansh Joshi
* **Role / Domain:** Backend Services & Geospatial Algorithms
* **Core Focus:** Station CRUD & Node Registration Endpoints
* **Weekly Tasks:**
  * Built the `GET /api/stations` endpoint to list all registered monitoring stations with status indicators.
  * Built the `GET /api/stations/{id}` endpoint for granular single-station telemetry inspection.
  * Built the `POST /api/stations` endpoint enabling operators to dynamically register new physical or virtual sensor nodes with coordinate validation.
* **Key Deliverable:** Complete Station Management REST Controller.

---

### 4. Devansh Mittal
* **Role / Domain:** Backend Simulation & Automated Alerting
* **Core Focus:** Automated Safety Threshold Inspection & Alert Generation
* **Weekly Tasks:**
  * Implemented real-time threshold inspection during every 6-second heartbeat simulation tick.
  * Programmed automatic generation of `EnvironmentalAlert` entities when:
    * $\text{AQI} \ge 250 \rightarrow$ `CRITICAL AIR QUALITY HAZARD`
    * $\text{Temperature} \ge 38^\circ\text{C} \rightarrow$ `EXTREME THERMAL HEAT SPIKE`
  * Prevented duplicate spam alert generation while stations remain in persistent hazard states.
* **Key Deliverable:** Automated Safety Threshold Detection Rule Engine.

---

### 5. Garv Kumar
* **Role / Domain:** Database Architecture & Application
* **Core Focus:** Authentication Service & Duplicate User Validation
* **Weekly Tasks:**
  * Implemented `registerUser()` with username and email duplicate checks in `AuthService.java`.
  * Implemented `login()` with credential verification against salted SHA-256 hashes and session token issuance.
  * Created user profile retrieval and device coordinate persistence update methods.
* **Key Deliverable:** Unit-Tested Authentication Business Logic Layer.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | 3 Toggleable Visual Canvas Modes | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | GPS Location Pairing Modal Dialog UI | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Complete Station Management REST Controller | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Automated Threshold Detection Rule Engine | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | Authentication Business Logic Layer | ✅ Completed |
