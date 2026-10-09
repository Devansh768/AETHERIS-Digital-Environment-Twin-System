# Week 2: Mathematical Proofs, Design Tokens & Database Modeling (July 13 – July 19, 2026)
## AETHERIS — 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 2 of the AETHERIS project transitioned from planning into formal mathematical modeling, visual design token creation, and relational database schema normalization across all 5 engineering modules.

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
- **Role / Domain:** Frontend Canvas & Computer Graphics
- **Core Focus:** Coordinate Projection Math & Particle Velocity Physics
- **Weekly Tasks:**
  - Formulated the mathematical projection formula to convert real-world geographic coordinates $(\text{Latitude}, \text{Longitude})$ into Canvas $(X, Y)$ screen pixel coordinates.
  - Designed the particle physics equations: position updates ($x = x + v_x$, $y = y + v_y$), wind velocity vector drift, and alpha opacity lifecycle fading.
- **Key Deliverable:** Coordinate Mapping Formulas & Particle Physics Algorithm Document.

---

### 2. Dhruv Jain
- **Role / Domain:** Frontend UI/UX & Web Dashboard
- **Core Focus:** Design Tokens, Typography & Color Palette System
- **Weekly Tasks:**
  - Created the project design system using CSS custom variables (`:root` tokens in `frontend/css/style.css`).
  - Configured typography utilizing modern monospace and clean sans-serif typefaces (`Outfit`, `Inter`, `JetBrains Mono`).
  - Defined neon cybernetic accent colors:
    - **Cyan:** `#00f0ff`
    - **Amber:** `#ffb700`
    - **Emerald:** `#00ff88`
    - **Crimson:** `#ff0055`
- **Key Deliverable:** UI Design Style Guide & CSS Variables Token Sheet.

---

### 3. Devansh Joshi
- **Role / Domain:** Backend Services & Geospatial Algorithms
- **Core Focus:** Mathematical Modeling: Haversine & Forward Bearing Formulas
- **Weekly Tasks:**
  - Formulated the **Haversine Distance Formula**:
    $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
    *(where $R = 6371\text{ km}$, $\phi = \text{latitude in radians}$, $\lambda = \text{longitude in radians}$)*
  - Formulated the **Forward Azimuth (Compass Bearing)** formula:
    $$\theta = \text{atan2}\left(\sin(\Delta \lambda)\cos(\phi_2), \; \cos(\phi_1)\sin(\phi_2) - \sin(\phi_1)\cos(\phi_2)\cos(\Delta \lambda)\right)$$
  - Validated mathematical formulas against sample geospatial coordinates.
- **Key Deliverable:** Mathematical Algorithm Proofs & Coordinate Conversion Logic.

---

### 4. Devansh Mittal
- **Role / Domain:** Backend Simulation & Automated Alerting
- **Core Focus:** Mathematical Drift Modeling & Weighted Random Walks
- **Weekly Tasks:**
  - Formulated the **Weighted Smooth Random Walk** equation for authentic microclimate sensor variation:
    $$\text{Value}_t = (0.85 \cdot \text{Value}_{t-1}) + (0.15 \cdot \text{Baseline}) + \Delta_{\text{random}}$$
  - Engineered the weighting parameters ($0.85$ previous step, $0.15$ pull toward baseline) to prevent erratic data jumps while maintaining organic, continuous environmental drift.
- **Key Deliverable:** Mathematical Sensor Drift Algorithm Specification.

---

### 5. Garv Kumar
- **Role / Domain:** Database Architecture & Application
- **Core Focus:** Entity-Relationship (ER) Modeling & 3NF Normalization
- **Weekly Tasks:**
  - Designed the Entity-Relationship (ER) diagram mapping the 4 core entities:
    - `users`
    - `stations`
    - `telemetry_records`
    - `environmental_alerts`
  - Applied 3rd Normal Form (3NF) normalization to eliminate data redundancy and anomalies.
  - Defined relational constraints: $1:\text{N}$ relationship from stations to telemetry records and alerts.
- **Key Deliverable:** Final Database ER Diagram & Table Schema Architecture.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Coordinate Projection & Particle Physics Document | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | UI Design Style Guide & CSS Token Sheet | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Haversine & Bearing Proofs Algorithm Document | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Weighted Random Walk Drift Algorithm Spec | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | 3NF Database ER Diagram & Schema Architecture | ✅ Completed |
