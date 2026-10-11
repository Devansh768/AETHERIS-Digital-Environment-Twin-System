# Week 11: Cross-Module System Integration & CORS Wiring (September 14 – September 20, 2026)
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 11 achieved full-system end-to-end integration across frontend visual rendering layers, UI dashboard controls, and Spring Boot backend micro-services. Universal CORS support was established in `CorsConfig.java` to support cross-origin decoupled execution, real-time simulation trigger buttons were wired directly to canvas pulse halos and Bézier chart updates, Role-Based Access Control (RBAC) was enforced on administrative operations, and dynamic station registration was connected across the database persistence layer, live simulation engine, and spatial indexing pipelines.

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
* **Core Focus:** Canvas & Telemetry Stream Synchronization
* **Weekly Tasks:**
  * Integrated canvas pulse halos and glowing beacon animations with live incoming telemetry feeds from the backend polling service.
  * Synchronized real-time cubic Bézier chart curves (`frontend/js/charts.js`) with active simulation updates and environmental anomalies.
  * Added dynamic visual state transitions for stations entering hazard, alert, or warning status on the 2.5D grid.
* **Key Deliverable:** Canvas & Telemetry Stream Synchronization (Live Halos & Splines).

---

### 2. Dhruv Jain
* **Role / Domain:** Frontend UI/UX & Web Dashboard
* **Core Focus:** Interactive Simulation Controls & Dashboard UI Wiring
* **Weekly Tasks:**
  * Wired dashboard simulation buttons (*Heatwave, Smog Spike, Industrial Leak*) to backend simulation REST endpoints (`POST /api/simulation/trigger`).
  * Connected user status badges and role verification to UI action controls, dynamically toggling simulation buttons based on privileges.
  * Added automated visual feedback toasts for successful simulation injections and station registrations.
* **Key Deliverable:** Interactive Simulation Controls & Dashboard UI Wiring.

---

### 3. Devansh Joshi
* **Role / Domain:** Backend Services & Geospatial Algorithms
* **Core Focus:** Dynamic Station Pipeline & Spatial Indexing Integration
* **Weekly Tasks:**
  * Integrated dynamic station creation pipeline across database persistence, live simulation cycle, and frontend sync.
  * Verified automatic spatial recalculations and nearest-neighbor indexing for dynamically added stations.
  * Validated real-time Haversine distance and bearing updates for newly registered sensor nodes during live client geolocation pairing.
* **Key Deliverable:** Dynamic Station Pipeline & Spatial Indexing Integration.

---

### 4. Devansh Mittal
* **Role / Domain:** Backend Simulation & Automated Alerting
* **Core Focus:** End-to-End Hazard Triggering & Alert Pipeline
* **Weekly Tasks:**
  * Wired live simulation triggers with automated alert generation and telemetry deviation engines.
  * Enforced RBAC simulation permissions restricting hazard injections to authorized operators and admins.
  * Validated automated alert dispatching and threshold breach broadcasts during live hazard simulations.
* **Key Deliverable:** End-to-End Hazard Triggering & Alert Pipeline.

---

### 5. Garv Kumar
* **Role / Domain:** Database Architecture & Security
* **Core Focus:** Universal CORS Configuration & Cross-Module Verification
* **Weekly Tasks:**
  * Configured universal cross-origin support in `CorsConfig.java` (`allowedOriginPatterns("*")`, methods, headers, preflight cache).
  * Tested and verified cross-origin communication between decoupled frontend (`http://localhost:5050`) and backend (`http://localhost:9090`).
  * Verified end-to-end cross-module data flow, request header validation, and token authentication.
* **Key Deliverable:** Universal CORS Configuration & Cross-Module Verification.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Canvas & Telemetry Stream Synchronization | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Interactive Simulation Controls & Dashboard UI Wiring | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Dynamic Station Pipeline & Spatial Indexing Integration | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | End-to-End Hazard Triggering & Alert Pipeline | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | Universal CORS Configuration & Cross-Module Verification | ✅ Completed |
