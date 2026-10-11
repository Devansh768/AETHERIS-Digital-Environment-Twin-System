# Week 9: Dynamic Canvas Charts, Region Filters, Alert Service & RBAC (August 31 – September 6, 2026)
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 9 concluded Stage 3 by completing real-time spline charting, multi-region filtering, operator alert lifecycles, and security endpoints: authoring the zero-dependency cubic Bézier chart engine in `charts.js`, developing the State/Region filter bar and sliding alert banners in the dashboard, building multi-state query filtering in `StationService.java`, implementing alert acknowledgement routines, and exposing `AuthController.java` with Role-Based Access Control (`ADMIN`, `OPERATOR`, `RESEARCHER`).

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
* **Core Focus:** Dynamic Canvas Charting Engine & Cubic Bézier Curves
* **Weekly Tasks:**
  * Authored `frontend/js/charts.js` without relying on heavy external chart libraries (e.g. Chart.js).
  * Implemented cubic Bézier spline interpolation to render smooth time-series curves for AQI and Temperature historical trends.
  * Added dynamic canvas grid lines, value labels, and auto-scaling Y-axes computed from incoming data min/max values.
* **Key Deliverable:** Lightweight Real-Time Canvas Chart Engine.

---

### 2. Dhruv Jain
* **Role / Domain:** Frontend UI/UX & Web Dashboard
* **Core Focus:** State/Region Selector, Station Inspection & Alert Banners
* **Weekly Tasks:**
  * Built the State/Region dropdown selector (Delhi NCR, Maharashtra, Karnataka, Tamil Nadu, Uttar Pradesh, Gujarat).
  * Implemented the station selection card that highlights and displays the currently inspected sensor station.
  * Added visual warning notification banners that smoothly slide down from the top viewport when severe alerts trigger.
* **Key Deliverable:** State/Region Filter Bar & Sliding Hazard Banner.

---

### 3. Devansh Joshi
* **Role / Domain:** Backend Services & Geospatial Algorithms
* **Core Focus:** State & Regional Zone Query Filtering
* **Weekly Tasks:**
  * Built regional query filtering methods in `StationService.java` (`findByState` and `findDistinctStates`).
  * Implemented zone classification handling (*Urban Core, Industrial Park, Forest Reserve, Coastal Basin*).
  * Added support for regional nearest station queries (`?lat=...&lng=...&state=...`) allowing users to find the closest node within a designated state.
* **Key Deliverable:** Multi-Region Station Query & Filtering Service.

---

### 4. Devansh Mittal
* **Role / Domain:** Backend Simulation & Automated Alerting
* **Core Focus:** Alert Query Repository & Operator Acknowledgement Lifecycle
* **Weekly Tasks:**
  * Built the alert query repository methods (`findUnacknowledgedAlerts()`) to fetch pending warnings.
  * Implemented operator alert acknowledgement logic (`acknowledgeAlert()`) allowing operators to resolve warnings.
  * Enforced alert state transitions ensuring resolved warnings clear without lingering on client dashboards.
* **Key Deliverable:** Alert Management & Operator Acknowledgement Service.

---

### 5. Garv Kumar
* **Role / Domain:** Database Architecture & Application
* **Core Focus:** Authentication REST Controller & Role-Based Access Control (RBAC)
* **Weekly Tasks:**
  * Built `AuthController.java` exposing `/api/auth/login`, `/api/auth/register`, and `/api/auth/me`.
  * Configured Role-Based Access Control (`ROLE_ADMIN`, `ROLE_OPERATOR`, `ROLE_RESEARCHER`).
  * Protected administrative endpoints (disaster injection and station creation) so only authorized roles can invoke them.
* **Key Deliverable:** Role-Based Access Control & Auth REST Controller.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Lightweight Real-Time Canvas Chart Engine | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Region Filter Bar & Sliding Hazard Banner | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Multi-Region Station Query & Filtering Service | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Alert Management & Acknowledgement Service | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | RBAC Authentication REST Controller | ✅ Completed |
