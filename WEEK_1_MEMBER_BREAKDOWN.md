# Week 1: Project Requirements & Architectural Planning (July 6 – July 12, 2026)
## AETHERIS — 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 1 of the AETHERIS Digital Twin project focused on foundational system scoping, technical research, mathematical specifications, UI/UX wireframing, database schema planning, and API contract design across all 5 project modules.

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
- **Core Focus:** Canvas Viewport Architecture, Rendering Pipeline & Particle Math
- **Weekly Tasks:**
  - Researched 2.5D isometric projection techniques and HTML5 Canvas 2D context rendering pipelines.
  - Formulated graphics specifications: canvas resolution, device pixel ratio (HiDPI/Retina display scaling), target frame rate (locked 60 FPS via `requestAnimationFrame`).
  - Sketched visual concepts for the cybernetic terrain grid, sensor beacons, and atmospheric particle flows.
- **Key Deliverable:** Graphics Architecture Plan & 2.5D Visual Design Wireframes.

---

### 2. Dhruv Jain
- **Role / Domain:** Frontend UI/UX & Web Dashboard
- **Core Focus:** Command Center Layout, Glassmorphism Design System & Wireframes
- **Weekly Tasks:**
  - Researched cybernetic and command-center dashboard interfaces (glassmorphism, dark obsidian themes, neon telemetry glows).
  - Drafted low-fidelity user experience (UX) wireframes for the master layout: top navigation header, 2.5D canvas viewport, live sensor metric cards, historical trend charts, and simulation drawer.
  - Planned the information architecture for EPA air quality rating visual badges and quick unit toggles (°C / °F).
- **Key Deliverable:** Low-Fidelity Wireframes & Dashboard Layout Blueprint.

---

### 3. Devansh Joshi
- **Role / Domain:** Backend Services & Geospatial Algorithms
- **Core Focus:** Spherical Trigonometry, Geolocation Architecture & API Contracts
- **Weekly Tasks:**
  - Researched spherical trigonometry principles and geospatial algorithms for mapping coordinates on Earth's curved surface.
  - Defined system requirements for client GPS proximity detection and station node registration.
  - Planned API contracts and JSON Data Transfer Objects (DTOs) for station data.
- **Key Deliverable:** Geospatial Specification Document & API Contract Design.

---

### 4. Devansh Mittal
- **Role / Domain:** Backend Simulation & Automated Alerting
- **Core Focus:** Environmental Modeling Principles & EPA Threshold Standards
- **Weekly Tasks:**
  - Researched environmental modeling principles (atmospheric particulate dispersion, heat island effects, humidity drift).
  - Defined safety threshold classifications based on global EPA standards:
    - **Air Quality Index (AQI):** Nominal ($< 100$), Unhealthy ($150 - 249$), Critical Hazard ($\ge 250$).
    - **Ambient Temperature:** Nominal ($22^\circ\text{C} - 32^\circ\text{C}$), Heat Advisory ($\ge 38^\circ\text{C}$).
  - Outlined the 4 baseline environmental zones: Urban Core, Industrial Park, Forest Reserve, and Coastal Basin.
- **Key Deliverable:** Environmental Simulation Specification & Threshold Standards Document.

---

### 5. Garv Kumar
- **Role / Domain:** Database Architecture & Application
- **Core Focus:** Requirements Specification, Entity Identification & Storage Plan
- **Weekly Tasks:**
  - Analyzed functional requirements of the Digital Twin platform with the entire engineering team.
  - Identified data storage needs for real-time sensor metrics, user authentication, monitoring stations, and threshold alerts.
  - Determined database constraints, indexing strategies for time-series queries, and data volume expectations.
  - Established the 4 core entities: `users`, `stations`, `telemetry_records`, and `environmental_alerts`.
- **Key Deliverable:** Requirements Specification Document & Draft Database Plan.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Graphics Architecture Plan & 2.5D Wireframes | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Low-Fidelity Wireframes & Layout Blueprint | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Geospatial Specification & API Contracts | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Environmental Simulation Specs & Thresholds | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | Requirements Spec & Draft Database Plan | ✅ Completed |
