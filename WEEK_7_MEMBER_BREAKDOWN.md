# Week 7: Air Dispersion Halos, KPI Gauges, Proximity API & Hazard Engine (August 17 – August 23, 2026)
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 7 inaugurated Stage 3: programming the dynamic Air Quality Dispersion Mode in the 2.5D Canvas engine with radial color halos and atmospheric haze blending, constructing the 8 live sensor KPI telemetry panels with one-click °C / °F conversion, exposing the `/api/stations/nearest` REST endpoint, engineering the 4 "What-If" hazard scenarios with intensity multipliers, and implementing salted SHA-256 cryptographic password hashing.

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
* **Core Focus:** Air Quality Dispersion Halos & Atmospheric Haze Blending
* **Weekly Tasks:**
  * Programmed the Air Dispersion visualization mode in `frontend/js/twin-canvas.js`.
  * Built radial gradient halos around each sensor node that dynamically expand and change color according to real-time AQI and PM2.5 concentrations.
  * Added particulate haze blending modes (`destination-over` / `lighter`) to simulate realistic atmospheric particulate diffusion.
* **Key Deliverable:** Air Quality Dispersion Visualization Layer.

---

### 2. Dhruv Jain
* **Role / Domain:** Frontend UI/UX & Web Dashboard
* **Core Focus:** 8 Live KPI Telemetry Cards & Temperature Unit Toggle
* **Weekly Tasks:**
  * Built the 8 core sensor metric display cards: Air Quality Index (AQI), Ambient Temperature, Relative Humidity, $\text{CO}_2$, Particulates (PM2.5 & PM10), Acoustic Noise (dB), UV Index, and Wind Vector.
  * Integrated dynamic EPA rating badges (*Good, Moderate, Unhealthy, Hazardous*) with status-tailored color accents.
  * Implemented an interactive one-click °C / °F temperature unit toggle with automatic state updates across cards.
* **Key Deliverable:** Interactive 8-KPI Telemetry Card Panel.

---

### 3. Devansh Joshi
* **Role / Domain:** Backend Services & Geospatial Algorithms
* **Core Focus:** Nearest Station Proximity REST Endpoint
* **Weekly Tasks:**
  * Created the nearest station calculation algorithm in `StationService.java` that iterates active stations to determine the minimum spherical distance.
  * Exposed the endpoint `GET /api/stations/nearest?lat={lat}&lng={lng}` in `backend/src/main/java/com/digitaltwin/environment/controller/StationController.java`.
  * Verified endpoint responses across varied geographical coordinates using Postman test collections.
* **Key Deliverable:** Working `/api/stations/nearest` Proximity REST API.

---

### 4. Devansh Mittal
* **Role / Domain:** Backend Simulation & Automated Alerting
* **Core Focus:** "What-If" Hazard Scenario Engine & Intensity Scaling
* **Weekly Tasks:**
  * Programmed the 4 core disturbance scenarios in `TelemetryService.java`:
    * `HEATWAVE`: Injects $+7.5^\circ\text{C}$ temperature surge, drops humidity by $-15\%$, and boosts AQI by $+35\%$.
    * `INDUSTRIAL_EMISSION`: Multiplies AQI by $1.8\times$ and $\text{CO}_2$ by $1.6\times$ in industrial sectors.
    * `RAIN_CLEANSING`: Increases humidity by $+22\%$, drops temperature by $-4.5^\circ\text{C}$, and cuts particulate pollution in half.
    * `NORMAL`: Clears active disturbances and resets nodes to baseline conditions.
  * Added scenario intensity scaling ($0.5\times - 3.0\times$) and timed duration expiration decay.
* **Key Deliverable:** Environmental Hazard Disturbance Simulation Engine.

---

### 5. Garv Kumar
* **Role / Domain:** Database Architecture & Application
* **Core Focus:** Salted SHA-256 Password Encryption & Token Generation
* **Weekly Tasks:**
  * Built cryptographic password encryption routines using salted SHA-256 in `AuthService.java`.
  * Implemented secure session token generation for authenticating incoming API requests.
  * Ensured zero plain-text passwords are stored in the database or exposed via API payloads.
* **Key Deliverable:** Salted SHA-256 Password Encryption & Token Service.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Air Quality Dispersion Visualization Layer | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Interactive 8-KPI Telemetry Card Panel | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Working `/api/stations/nearest` REST API | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Hazard Disturbance Simulation Engine | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | Salted SHA-256 Auth & Token Service | ✅ Completed |
