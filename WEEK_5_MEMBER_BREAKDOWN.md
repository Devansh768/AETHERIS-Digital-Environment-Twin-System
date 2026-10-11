# Week 5: Particle Physics, Glassmorphism UI & Dual-Database Persistence (August 3 – August 9, 2026)
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 5 focused on advancing the core subsystems: implementing the 90+ atmospheric particulate vector simulation in HTML5 Canvas, constructing the futuristic dark-mode glassmorphism CSS engine, programming the forward azimuth compass bearing calculator with 16 cardinal points in Java, building mathematical generators for all 9 telemetry metrics, and compiling JPA domain entities with resilient dual-database fallback.

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
* **Core Focus:** Atmospheric Particle Physics & Vector Motion Engine
* **Weekly Tasks:**
  * Implemented atmospheric particulate generator simulating 90+ concurrent wind/mist particles.
  * Programmed vector physics dynamics: random horizontal/vertical velocity vectors ($v_x, v_y$), variable diameters ($1\text{px} - 3.5\text{px}$), and smooth alpha lifespan decay.
  * Built boundary wrapping mechanics: particles exiting any viewport edge automatically re-enter from the opposite boundary to sustain continuous atmospheric flow.
* **Key Deliverable:** Continuous Atmospheric Particle Physics Engine.

---

### 2. Dhruv Jain
* **Role / Domain:** Frontend UI/UX & Web Dashboard
* **Core Focus:** Dark-Mode Glassmorphism CSS Engine & Status Badges
* **Weekly Tasks:**
  * Programmed advanced glassmorphism styles in `frontend/css/style.css` using `backdrop-filter: blur(12px)`, translucent obsidian backgrounds, and subtle neon border glows.
  * Built glowing telemetry status badges (`ACTIVE`, `STANDBY`, `HAZARD`).
  * Engineered interactive micro-animations for dashboard card hover elevation and glowing pulse effects.
* **Key Deliverable:** Futuristic Glassmorphism CSS Engine & Badge Tokens.

---

### 3. Devansh Joshi
* **Role / Domain:** Backend Services & Geospatial Algorithms
* **Core Focus:** Trigonometric Compass Bearing & 16-Point Cardinal Classifier
* **Weekly Tasks:**
  * Programmed the Forward Azimuth compass bearing calculation method using trigonometric `atan2` in `backend/src/main/java/com/digitaltwin/environment/service/StationService.java`.
  * Implemented circular coordinate angle normalization mapping all azimuth values cleanly into the standard $0^\circ - 360^\circ$ space.
  * Built the direction classifier mapping continuous degrees into 16 cardinal compass points (e.g., $0^\circ \rightarrow \text{N}$, $45^\circ \rightarrow \text{NE}$, $315^\circ \rightarrow \text{NW}$).
* **Key Deliverable:** Accurate Compass Bearing & 16-Point Cardinal Classifier.

---

### 4. Devansh Mittal
* **Role / Domain:** Backend Simulation & Automated Alerting
* **Core Focus:** Telemetry Metric Generators & Health Status Summarizer
* **Weekly Tasks:**
  * Programmed mathematical telemetry generators for all 9 environmental parameters: AQI, PM2.5, PM10, Ambient Temperature, Relative Humidity, $\text{CO}_2$, Acoustic Noise (dB), UV Index, and Wind Vector (speed & direction).
  * Built dynamic health and operational status summarization logic (e.g., "Optimal Operational Range", "Pristine Atmospheric Condition", "Hazardous Air Quality").
  * Ensured generated telemetry bounds conform to global EPA ambient standards.
* **Key Deliverable:** Full Multi-Parameter Sensor Record Generator.

---

### 5. Garv Kumar
* **Role / Domain:** Database Architecture & Application
* **Core Focus:** JPA Entity Models & Resilient Dual-Database Fallback
* **Weekly Tasks:**
  * Created Java domain entity classes with Jakarta Persistence annotations (`@Entity`, `@Table`, `@Id`, `@Column`): `User.java`, `Station.java`, `TelemetryRecord.java`, and `EnvironmentalAlert.java`.
  * Built Spring Data JPA repository interfaces (`UserRepository`, `StationRepository`, `TelemetryRecordRepository`, `EnvironmentalAlertRepository`).
  * Implemented `DataSourceConfig.java` to support zero-config dual-database operation: automatically connects to MySQL on port 3306, but gracefully falls back to an in-memory H2 database if MySQL is unreachable.
* **Key Deliverable:** Compiled JPA Entity Layer & Resilient Dual-Database Fallback.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Atmospheric Particle Physics Engine | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Glassmorphism CSS Engine & Badge Tokens | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Compass Bearing & 16-Point Cardinal Classifier | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Multi-Parameter Sensor Record Generator | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | JPA Entity Layer & Dual-DB Fallback | ✅ Completed |
