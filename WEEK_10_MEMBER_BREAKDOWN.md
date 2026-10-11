# Week 10: Interactive Hit-Testing, Geodesic Links, Polling & Client Auth (September 7 – September 13, 2026)
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 10 commenced Stage 4 (Interactivity, System Integration & Execution): implementing 24px Euclidean hit-testing on the 2.5D canvas, projecting the animated geodesic connection laser beam from client GPS coordinates to target sensor beacons, establishing the dashboard master orchestrator (`app.js`) with 5-second asynchronous polling, exposing REST controllers for Simulation, Telemetry, and Alerting, and integrating client authentication with 1-click demo logins.

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
* **Core Focus:** Interactive Canvas Hit-Testing & Geodesic Laser Rendering
* **Weekly Tasks:**
  * Implemented canvas mouse tracking and Euclidean distance hit-testing ($\sqrt{\Delta x^2 + \Delta y^2} \le 24\text{px}$) for hovering over and selecting sensor beacon nodes.
  * Programmed the animated geodesic laser beam connecting user device coordinates directly to the nearest paired station node on the 2.5D grid.
  * Added node click events that dispatch custom `stationSelected` events to update dashboard telemetry cards.
* **Key Deliverable:** Interactive Map Hit-Testing & Geodesic Laser Link.

---

### 2. Dhruv Jain
* **Role / Domain:** Frontend UI/UX & Web Dashboard
* **Core Focus:** Dashboard Master Controller & Asynchronous Polling Loop
* **Weekly Tasks:**
  * Built the central dashboard controller in `frontend/js/app.js`.
  * Implemented the 5-second non-blocking asynchronous polling loop to stream live telemetry updates from backend REST APIs.
  * Added event listeners to handle station selection events from Ishita's canvas clicks, updating telemetry display cards dynamically.
* **Key Deliverable:** Central Dashboard Master Orchestrator & Polling Loop.

---

### 3. Devansh Joshi
* **Role / Domain:** Backend Services & Geospatial Algorithms
* **Core Focus:** Geolocation Pairing Flow Integration & Coordinate Handoff
* **Weekly Tasks:**
  * Linked Dhruv Jain's location popup dialog to the `/api/stations/nearest` backend REST endpoint.
  * Transferred computed GPS coordinates, formatted distance strings, and cardinal bearing values to client state.
  * Handled smooth UI transition states while resolving nearest station coordinates and fed them to the canvas ray renderer.
* **Key Deliverable:** Seamless On-Screen Geolocation Pairing Flow.

---

### 4. Devansh Mittal
* **Role / Domain:** Backend Simulation & Automated Alerting
* **Core Focus:** Simulation, Telemetry & Alert REST Controllers
* **Weekly Tasks:**
  * Created `SimulationController.java` exposing `POST /api/simulation/trigger`.
  * Created `TelemetryController.java` exposing `GET /api/telemetry/live` and `GET /api/telemetry/history/{id}`.
  * Created `AlertController.java` exposing `GET /api/alerts` and `POST /api/alerts/{id}/acknowledge`.
* **Key Deliverable:** Fully Exposed Simulation, Telemetry & Alert REST APIs.

---

### 5. Garv Kumar
* **Role / Domain:** Database Architecture & Application
* **Core Focus:** Frontend Authentication Integration & Demo Credential Autofill
* **Weekly Tasks:**
  * Built `frontend/js/auth.js`, connecting the login/register modal UI to backend authentication endpoints.
  * Added 1-click demo credential autofill buttons (`admin` / `operator`) and token storage in browser `localStorage`.
  * Added dynamic UI updates to display user badge, email, and security role after login.
* **Key Deliverable:** Complete Frontend Authentication & Session Integration.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Interactive Map Hit-Testing & Geodesic Laser Link | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Central Dashboard Orchestrator & Polling Loop | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Seamless On-Screen Geolocation Pairing Flow | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Simulation, Telemetry & Alert REST Controllers | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | Frontend Authentication & Session Integration | ✅ Completed |
