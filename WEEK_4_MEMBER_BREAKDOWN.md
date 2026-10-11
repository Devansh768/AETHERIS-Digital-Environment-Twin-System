# Week 4: Database Architecture, Core Foundations & UI Mock-ups
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## Project Administration

### Team Members

| Name | Enrollment | Email | Mobile |
| :--- | :--- | :--- | :--- |
| **Devansh Joshi** | 24E1ARADM40P039 | devanshjoshi980@gmail.com | 7597934912 |
| **Devansh Mittal** | 24E1ARADM40P041 | devanshmittal308@gmail.com | 6375536662 |
| **Dhruv Jain** | 24E1ARADM40P043 | dhruvtorawat5555@gmail.com | 8239361149 |
| **Garv Kumar** | 24E1ARADM40P049 | garvmittal94068@gmail.com | 7412894068 |
| **Ishita Sinha** | 24E1ARADF40P063 | ishsinha1106@gmail.com | 9241970138 |

---

## 1. Database Architecture & Relational Persistence Schema

The AETHERIS system operates on an ACID-compliant **Relational Persistence Architecture** managed via **Spring Data JPA** and **Hibernate**, connecting to **MySQL 8.0** with transparent failover to an in-memory **H2 Database**.

### A. MySQL Relational Schema (`database/schema.sql`)

* **`stations` Table**: Physical and virtual microclimate sensor node registry.
  * `id` (`VARCHAR(50)`, `PRIMARY KEY`) — Station identifier (e.g. `NODE-METRO-01`, `NODE-FOREST-03`)
  * `name` (`VARCHAR(100)`, `NOT NULL`) — Descriptive station title
  * `state` (`VARCHAR(100)`, `NOT NULL`, `DEFAULT 'Delhi NCR'`) — Region/State for filtering
  * `zone_type` (`VARCHAR(50)`, `NOT NULL`) — `URBAN_CORE`, `INDUSTRIAL_PARK`, `FOREST_RESERVE`, `COASTAL_BASIN`
  * `latitude` (`DOUBLE`, `NOT NULL`) — WGS-84 Decimal Latitude (-90.0 to +90.0)
  * `longitude` (`DOUBLE`, `NOT NULL`) — WGS-84 Decimal Longitude (-180.0 to +180.0)
  * `elevation` (`DOUBLE`, `DEFAULT 25.0`) — Elevation above ground level in meters
  * `status` (`VARCHAR(20)`, `NOT NULL`, `DEFAULT 'ACTIVE'`) — `ACTIVE`, `MAINTENANCE`, `OFFLINE`
  * `description` (`TEXT`) — Operational purpose and geographical notes
  * `installed_at` (`TIMESTAMP`, `DEFAULT CURRENT_TIMESTAMP`) — Commissioning timestamp

* **`telemetry_records` Table**: High-frequency time-series environmental sensor telemetry.
  * `id` (`BIGINT`, `PRIMARY KEY`, `AUTO_INCREMENT`)
  * `station_id` (`VARCHAR(50)`, `FOREIGN KEY` $\rightarrow$ `stations.id`)
  * `aqi` (`INT`, `NOT NULL`) — Air Quality Index calculated via EPA standard (0–500 scale)
  * `pm25` (`DOUBLE`, `NOT NULL`) — Fine particulate matter ($\mu\text{g}/\text{m}^3$)
  * `pm10` (`DOUBLE`, `NOT NULL`) — Coarse particulate matter ($\mu\text{g}/\text{m}^3$)
  * `temperature` (`DOUBLE`, `NOT NULL`) — Ambient air temperature in Celsius (°C)
  * `humidity` (`DOUBLE`, `NOT NULL`) — Relative humidity percentage (0–100%)
  * `co2` (`DOUBLE`, `NOT NULL`) — Carbon dioxide concentration (ppm)
  * `noise_db` (`DOUBLE`, `NOT NULL`) — Ambient acoustic noise level (dB)
  * `uv_index` (`DOUBLE`, `NOT NULL`) — Solar ultraviolet radiation index (0–12)
  * `wind_speed` (`DOUBLE`, `NOT NULL`) — Wind velocity (km/h)
  * `wind_direction` (`VARCHAR(20)`, `DEFAULT 'NE'`) — 16-point cardinal compass heading
  * `status_summary` (`VARCHAR(50)`) — Plain-English operational verdict
  * `recorded_at` (`TIMESTAMP`, `DEFAULT CURRENT_TIMESTAMP`) — **Indexed** for time-series queries

* **`environmental_alerts` Table**: Threshold breach events and emergency warnings.
  * `id` (`BIGINT`, `PRIMARY KEY`, `AUTO_INCREMENT`)
  * `station_id` (`VARCHAR(50)`, `FOREIGN KEY` $\rightarrow$ `stations.id`)
  * `severity` (`VARCHAR(20)`, `NOT NULL`) — `INFO`, `WARNING`, `CRITICAL`, `HAZARD`
  * `category` (`VARCHAR(50)`, `NOT NULL`) — `AIR_QUALITY`, `HEAT_STRESS`, `CO2_SPIKE`, `NOISE`
  * `title` (`VARCHAR(120)`, `NOT NULL`) — Headline advisory title
  * `message` (`VARCHAR(255)`, `NOT NULL`) — Actionable mitigation guidelines
  * `acknowledged` (`BOOLEAN`, `DEFAULT FALSE`) — Operator acknowledgment status flag
  * `triggered_at` (`TIMESTAMP`, `DEFAULT CURRENT_TIMESTAMP`)

* **`users` Table**: Cryptographic authentication and role authorization.
  * `id` (`BIGINT`, `PRIMARY KEY`, `AUTO_INCREMENT`)
  * `username` (`VARCHAR(50)`, `UNIQUE`, `NOT NULL`)
  * `email` (`VARCHAR(100)`, `UNIQUE`, `NOT NULL`)
  * `password_hash` (`VARCHAR(255)`, `NOT NULL`) — Salted SHA-256 cryptographic hash
  * `role` (`VARCHAR(20)`, `NOT NULL`, `DEFAULT 'OPERATOR'`) — `ROLE_ADMIN`, `ROLE_OPERATOR`, `ROLE_RESEARCHER`
  * `last_latitude` (`DOUBLE`) — Last reported client GPS latitude
  * `last_longitude` (`DOUBLE`) — Last reported client GPS longitude
  * `created_at` (`TIMESTAMP`, `DEFAULT CURRENT_TIMESTAMP`)

---

## 2. Member-Wise Implementation Breakdown

### 1. Ishita Sinha
* **Module:** Frontend Canvas & Computer Graphics
* **Core Deliverable:** HTML5 Canvas Initialization, Viewport Sizing & 60 FPS Render Loop
* **Technical Details:**
  * Created the core graphics engine class `TwinCanvasEngine` in `frontend/js/twin-canvas.js`.
  * Implemented responsive auto-resizing with `window.devicePixelRatio` scaling to eliminate pixelation on HiDPI / Retina displays.
  * Initialized the main 60 FPS rendering cycle driven by `window.requestAnimationFrame()`.
  * Configured offscreen rendering buffers to ensure smooth canvas redraws without UI stutter.

---

### 2. Dhruv Jain
* **Module:** Frontend UI/UX & Web Dashboard
* **Core Deliverable:** Master Semantic HTML5 Skeleton & Command Center Layout
* **Technical Details:**
  * Built the master HTML document in `frontend/index.html`.
  * Structured semantic layout sections: `<header>` topbar, `<main>` command center grid, `<section>` for the 2.5D twin canvas viewport, `<aside>` telemetry cards, and `<footer>`.
  * Integrated design system CSS variables (`:root` tokens in `frontend/css/style.css`).
  * Ensured responsive CSS Grid and Flexbox adapters for laptops, tablets, and ultra-wide displays.

---

### 3. Devansh Joshi
* **Module:** Backend Services & Geospatial Algorithms
* **Core Deliverable:** Haversine Distance Calculation Engine in Java
* **Technical Details:**
  * Implemented the Haversine distance algorithm in `backend/src/main/java/com/digitaltwin/environment/service/StationService.java`.
  * Built degree-to-radian mathematical helpers ($d \times \frac{\pi}{180}$).
  * Programmed human-readable dynamic output formatting: returns meters if $< 1\text{ km}$ (e.g., `450 m`) or kilometers (e.g., `12.45 km`).
  * Wrote JUnit test cases comparing outputs against Google Maps GIS distance baselines.

---

### 4. Devansh Mittal
* **Module:** Backend Simulation & Automated Alerting
* **Core Deliverable:** Spring Boot Heartbeat Scheduler & Telemetry Generator
* **Technical Details:**
  * Enabled asynchronous scheduling via `@EnableScheduling` in the Spring Boot application configuration.
  * Programmed the background daemon timer `@Scheduled(fixedRate = 6000)` in `TelemetryService.java`.
  * Created the multi-station iteration loop that generates periodic telemetry updates across all active nodes every 6 seconds.
  * Integrated baseline parameters for Urban Core, Industrial Park, Forest Reserve, and Coastal Basin zones.

---

### 5. Garv Kumar
* **Module:** Database Architecture & Application
* **Core Deliverable:** Spring Boot JPA Configuration & Persistence Connection
* **Technical Details:**
  * Configured Maven dependencies in `pom.xml` for `spring-boot-starter-data-jpa` and `mysql-connector-j`.
  * Established JDBC connection pooling (HikariCP), Hibernate MySQL dialect, and SQL logging in `application.properties`.
  * Configured `DataSourceConfig.java` to support dual-database failover from MySQL to in-memory H2.
  * Validated database connectivity on port 3306 and initialized automatic table creation.

---

## 3. User Interface (UI) Mock-ups

#### A. AETHERIS Environmental Digital Twin & Command Center Dashboard
*Cybernetic dark-mode layout featuring the glassmorphic authentication gateway, product feature matrix (2.5D fluid twin, citizen dashboard, sub-10m GPS radar, ESG compliance), and live telemetry controls:*

* [AETHERIS Environmental Digital Twin Dashboard]![AETHERIS Dashboard](./images/dashboard.png)

---

## 4. Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Responsive 60 FPS Canvas Viewport | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Master Semantic HTML5 Skeleton | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Haversine Distance Service in Java | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | 6-Second Background Heartbeat Scheduler | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | Spring Boot Database Connection Setup | ✅ Completed |
