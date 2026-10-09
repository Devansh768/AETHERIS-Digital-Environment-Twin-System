# Week 3: Visual Layer Standards, DTO Specifications & SQL Schema (July 20 – July 26, 2026)
## AETHERIS — 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 3 centered on establishing visual environmental layer palettes, lightweight SVG asset integration, backend Data Transfer Objects (DTOs) for station geolocation pairing, zone baseline simulation matrices, and authoring the production MySQL relational schema script with high-performance time-series indexes.

---

### 📋 Team Members

| Name | Enrollment | Email | Mobile |
| :--- | :--- | :--- | :--- |
| **Devansh Joshi** | 24E1ARADM40P039 | devanshjoshi980@gmail.com | 7597934912 |
| **Devansh Mittal** | 24E1ARADM40P041 | devanshmittal308@gmail.com | 6375536662 |
| **Dhruv Jain** | 24E1ARADM40P043 | dhruvtorawat5555@gmail.com | 8239361149 |
| **devansh-mittal96** | — | — | — |
| **Ishita Sinha** | 24E1ARADF40P063 | ishsinha1106@gmail.com | 9241970138 |

---

## 👥 Member-Wise Breakdown & Tasks

### 1. Ishita Sinha
- **Role / Domain:** Frontend Canvas & Computer Graphics
- **Core Focus:** EPA Color Grading & Thermal Heatmap Gradient Specifications
- **Weekly Tasks:**
  - Defined dynamic color grading based on EPA Air Quality standards:
    - **Good (0 - 50):** Green (`#00ff88`)
    - **Moderate (51 - 100):** Yellow (`#ffb700`)
    - **Unhealthy (101 - 249):** Orange / Red (`#ff5500` / `#ff0055`)
    - **Hazardous (250+):** Purple (`#9d00ff`)
  - Designed smooth thermal color gradients (cool cyan to hot crimson) for the temperature heatmap dispersion layer.
- **Key Deliverable:** Color Palette Specification & Canvas Styling Sheet.

---

### 2. Dhruv Jain
- **Role / Domain:** Frontend UI/UX & Web Dashboard
- **Core Focus:** Component Architecture & Environmental SVG Iconography
- **Weekly Tasks:**
  - Planned reusable HTML component structures for telemetry widgets, status badges, state dropdown filters, and popup modals.
  - Selected and integrated lightweight SVG icons for environmental parameters:
    - Thermometer (Temperature)
    - Wind Vane (Wind Speed & Direction)
    - Sound Wave (Acoustic Noise dB)
    - Water Drop (Humidity)
    - Radiation Wave (UV Index)
- **Key Deliverable:** High-Fidelity Dashboard Mockups & SVG Asset Kit.

---

### 3. Devansh Joshi
- **Role / Domain:** Backend Services & Geospatial Algorithms
- **Core Focus:** DTO Modeling & 16-Point Cardinal Compass Mapping
- **Weekly Tasks:**
  - Designed the station domain structure (`id`, `name`, `state`, `zoneType`, `latitude`, `longitude`, `elevation`, `status`).
  - Authored the backend response model in `backend/src/main/java/com/digitaltwin/environment/dto/NearestStationResponse.java`.
  - Built the 16-point cardinal compass direction mapping table (`N`, `NNE`, `NE`, `ENE`, `E`, ..., `NW`, `NNW`).
- **Key Deliverable:** DTO Classes & Cardinal Direction Mapping Table.

---

### 4. Devansh Mittal
- **Role / Domain:** Backend Simulation & Automated Alerting
- **Core Focus:** Zone Baseline Profiles & Simulation DTOs
- **Weekly Tasks:**
  - Established zone-specific baseline profiles:
    - **Urban Core:** High traffic ($\text{AQI } 140$, $\text{Temp } 30^\circ\text{C}$, $\text{CO}_2 \; 560\text{ ppm}$)
    - **Industrial Park:** Manufacturing zone ($\text{AQI } 210$, $\text{Temp } 32.5^\circ\text{C}$, $\text{CO}_2 \; 720\text{ ppm}$)
    - **Forest Reserve:** Pristine bio-reserve ($\text{AQI } 42$, $\text{Temp } 24^\circ\text{C}$, $\text{CO}_2 \; 390\text{ ppm}$)
    - **Coastal Basin:** Marine zone ($\text{AQI } 88$, $\text{Temp } 26.5^\circ\text{C}$, $\text{Humidity } 74\%$)
  - Created `SimulationRequest.java` and `TelemetryDTO.java` for streaming simulated sensor ticks.
- **Key Deliverable:** Zone Baseline Matrix & Simulation DTO Classes.

---

### 5. devansh-mittal96
- **Role / Domain:** Database Architecture & Application
- **Core Focus:** Production MySQL Schema & Time-Series Indexing
- **Weekly Tasks:**
  - Authored the complete production SQL script in `database/schema.sql`.
  - Configured `utf8mb4` encoding, referential integrity constraints, default values, and auto-timestamps.
  - Added composite indexes on `station_id` and `recorded_at` to guarantee high query throughput on historical datasets.
- **Key Deliverable:** Complete & Executable `database/schema.sql`.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Color Palette Specification & Canvas Styling Sheet | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | High-Fidelity Mockups & SVG Asset Kit | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | DTO Classes & Cardinal Direction Mapping Table | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Zone Baseline Matrix & Simulation DTOs | ✅ Completed |
| **devansh-mittal96** | Database Architecture & Security | Complete & Executable `database/schema.sql` | ✅ Completed |
