# AETHERIS: Real-Time 2.5D Digital Environment Twin System

---

## Week 1

## Project Administration

* **Project Title:** AETHERIS — Real-Time 2.5D Digital Environment Twin for Microclimate Tracking & Hazard Simulation
* **Domain:** Environmental Informatics, Cybernetic Simulation & Geospatial Computing
* **Technology Stack:** Java 17, Spring Boot 3.3.5, Spring Data JPA, MySQL 8.0, In-Memory H2, HTML5 Canvas 2D, Vanilla JavaScript, CSS3 Glassmorphism

### Team Members

| Name | Enrollment | Email | Mobile |
| :--- | :--- | :--- | :--- |
| **Devansh Joshi** | 24E1ARADM40P039 | devanshjoshi980@gmail.com | 7597934912 |
| **Devansh Mittal** | 24E1ARADM40P041 | devanshmittal308@gmail.com | 6375536662 |
| **Dhruv Jain** | 24E1ARADM40P043 | dhruvtorawat5555@gmail.com | 8239361149 |
| **Garv Kumar** | 24E1ARADM40P049 | garvmittal94068@gmail.com | 7412894068 |
| **Ishita Sinha** | 24E1ARADF40P063 | ishsinha1106@gmail.com | 9241970138 |

### Module Ownership & Primary Responsibilities

| Name | Role / Domain | Project Module | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Devansh Joshi** | Backend Engineer | Geospatial & Location Services | Spherical Trigonometry, Haversine Distance Formula, Forward Azimuth Bearing, Geolocation REST APIs |
| **Ishita Sinha** | Frontend Engineer | Canvas 2.5D & Graphics Engine | 2.5D Isometric Terrain, 90+ Atmospheric Particle Fluid Engine, Custom Cubic Bézier Spline Charts |
| **Dhruv Jain** | UI/UX Engineer | Command Center & Dashboard | Cybernetic Glassmorphism UI, Responsive CSS Grid, 8 Live KPI Telemetry Cards, Region Filters |
| **Devansh Mittal** | Backend Engineer | Simulation & Alerting Engine | Weighted Random Walk Sensor Drift, 4 "What-If" Hazard Scenarios, Automated EPA Safety Alert Rules |
| **Garv Kumar** | Database Engineer | Architecture & Security | 3NF MySQL Relational Schema, Spring Data JPA Repositories, Salted SHA-256 Auth & RBAC Security |

---

## Abstract

Rapid urbanization and escalating industrialization have created volatile urban microclimates, characterized by localized heat islands, sudden particulate surges (PM2.5 / PM10), and dangerous greenhouse gas concentrations. Traditional environmental monitoring platforms remain fragmented—presenting static numeric spreadsheets or flat GIS maps that fail to convey dynamic atmospheric dispersion, directional drift, and real-time community impact.

**AETHERIS** introduces a distributed, full-stack **Digital Environment Twin System** engineered to bridge the gap between complex atmospheric science and real-time operational decision-making. Operating on a robust **Java Spring Boot 3.3.5** backend coupled with an interactive **HTML5 Canvas 2.5D visual engine**, the platform models living urban microclimates with continuous 6-second telemetry streams. The system integrates advanced spherical trigonometry—utilizing the **Haversine Great-Circle Distance Formula** and **Forward Azimuth Bearing** equations—to calculate the exact distance and compass orientation from any user's device to the nearest monitoring beacon, projecting a dynamic geodesic laser beam across the 2.5D terrain grid.

To move beyond passive observation into proactive risk management, AETHERIS features a mathematical **'What-If' Disaster Simulation Engine**. Operators can inject synthetic environmental disturbances—such as Extreme Heatwaves, Industrial Emission Surges, and Atmospheric Cleansing Storms—modeled via weighted smooth random walk algorithms. The visual digital twin reacts instantaneously: radial air quality halos dynamically swell, thermal gradient heatmaps adjust color spectrums from cyan to crimson, and automated threshold watchers trigger real-time hazard alerts whenever EPA limits are breached. Secured with salted SHA-256 password hashing and Role-Based Access Control (RBAC), and fortified with a dual-database architecture featuring automatic failover to an in-memory H2 database, AETHERIS delivers a resilient, audit-ready command center for smart municipalities, industrial parks, and ecological reserves.

---

## Week 2

## User Roles (Role-Based Access Control)

AETHERIS enforces strict Role-Based Access Control (RBAC) at the Spring Boot REST API layer to govern access across administrative, operational, and research capabilities:

* **System Administrator (`ROLE_ADMIN`)**:
  * Full administrative privileges across the entire environment twin platform.
  * Authorized to dynamically register, update, and deactivate physical and virtual monitoring stations via `/api/stations`.
  * Can inject and clear global 'What-If' hazard simulations (`HEATWAVE`, `INDUSTRIAL_EMISSION`, `RAIN_CLEANSING`, `NORMAL`).
  * Manages operator credentials and oversees system audit logs.

* **Lead Operator (`ROLE_OPERATOR`)**:
  * Frontline monitoring personnel assigned to environmental command centers.
  * Authorized to trigger calibrated disaster simulation drills to test emergency response protocols.
  * Can inspect active threshold breaches and formally acknowledge critical hazard alerts via `/api/alerts/{id}/acknowledge`.

* **Environmental Researcher (`ROLE_RESEARCHER`)**:
  * Academic and municipal analysts inspecting long-term atmospheric health trends.
  * Access to real-time telemetry feeds and historical time-series pagination queries (`/api/telemetry/history/{id}`).
  * Authorized to generate certified ISO 14001:2015 environmental audit compliance reports.

* **Guest Citizen / Public Viewer (`ROLE_GUEST`)**:
  * Unauthenticated or public users accessing localized air quality intelligence.
  * View-only access to nearest station telemetry, overall Clean Air Scores (0–100), and plain-English daily health advisories.

---

## Architecture & Core Modules

The AETHERIS system operates as a decoupled, multi-tiered architecture with a central Spring Boot Java application serving both REST API endpoints and static cybernetic client resources.

```mermaid
graph TD
    subgraph ClientLayer ["Client Presentation Layer (Browser)"]
        UI["Cybernetic Command Center Dashboard<br/>(index.html / style.css / app.js)"]
        CANVAS["2.5D Canvas Engine & Particle Fluid System<br/>(twin-canvas.js / charts.js)"]
        GEO_CLIENT["GPS Geolocation Pairing Radar<br/>(location.js)"]
        AUTH_CLIENT["Role-Based Access Control Modal<br/>(auth.js)"]
    end

    subgraph ControllerLayer ["REST Controller Layer (Spring Boot 3.3.5)"]
        SC["StationController<br/>/api/stations/*"]
        TC["TelemetryController<br/>/api/telemetry/*"]
        SIMC["SimulationController<br/>/api/simulation/*"]
        AC["AlertController<br/>/api/alerts/*"]
        AUTHC["AuthController<br/>/api/auth/*"]
    end

    subgraph ServiceLayer ["Business Logic & Simulation Engines"]
        SS["StationService<br/>(Haversine Distance & Bearing Math)"]
        TS["TelemetryService<br/>(Heartbeat Scheduler & What-If Hazard Injector)"]
        AS["AuthService<br/>(Salted SHA-256 Hashing & RBAC Guard)"]
    end

    subgraph RepositoryLayer ["Data Access Layer (Spring Data JPA)"]
        SR["StationRepository"]
        TR["TelemetryRecordRepository"]
        AR["EnvironmentalAlertRepository"]
        UR["UserRepository"]
    end

    subgraph PersistenceLayer ["Dual-Database Persistence Engine"]
        MYSQL[("MySQL 8.0 Production Database<br/>Port 3306")]
        H2[("In-Memory H2 Failover DB<br/>(Zero-Config Fallback)")]
    end

    UI --> SC & TC & SIMC & AC & AUTHC
    CANVAS --> TC
    GEO_CLIENT --> SC
    AUTH_CLIENT --> AUTHC

    SC --> SS
    TC --> TS
    SIMC --> TS
    AC --> TS
    AUTHC --> AS

    SS --> SR
    TS --> TR & AR
    AS --> UR

    SR & TR & AR & UR --> MYSQL
    MYSQL -.->|"Automatic Failover if offline"| H2
```

### Functional Modules

* **Module 1: Geospatial Proximity & Geolocation Services** (*Devansh Joshi*)
  * Integrates the W3C Browser Geolocation API with backend spherical trigonometry algorithms.
  * Computes Great-Circle Distance using the Haversine formula ($R = 6371\text{ km}$) and calculates Forward Azimuth compass bearing angles.
  * Exposes `/api/stations/nearest` to resolve closest sensor nodes and return human-readable distance metrics (meters or kilometers).

* **Module 2: 2.5D Isometric Canvas & Atmospheric Fluid Engine** (*Ishita Sinha*)
  * Custom HTML5 Canvas rendering pipeline executing at a locked 60 FPS via `requestAnimationFrame`.
  * Simulates 90+ concurrent atmospheric wind and particulate vectors with variable velocity ($v_x, v_y$), lifespan decay, and screen boundary wrapping.
  * Powers 3 switchable visual modes: Air Quality Dispersion Halos, Ambient Thermal Heatmap, and Radar Proximity Sweep.
  * Lightweight cubic Bézier spline interpolation in `charts.js` for smooth real-time telemetry curves.

* **Module 3: Cybernetic Command Dashboard & Telemetry Visualization** (*Dhruv Jain*)
  * Futuristic dark-mode glassmorphism interface styled via CSS custom variables (`:root` tokens in `style.css`).
  * 8 core telemetry KPI display cards (AQI, Temperature, Relative Humidity, $\text{CO}_2$, PM2.5, PM10, Noise dB, UV Index, Wind Speed & Direction).
  * State and regional dropdown filter controls with real-time UI notification banners for threshold hazards.
  * Central client orchestrator (`app.js`) running a non-blocking 5-second asynchronous polling loop.

* **Module 4: Background Simulation Heartbeat & Hazard Injection Engine** (*Devansh Mittal*)
  * Spring `@Scheduled(fixedRate = 6000)` background scheduler breathing organic variation into all 9 environmental parameters.
  * Weighted Smooth Random Walk algorithm ($\text{Value}_t = 0.85 \cdot \text{Value}_{t-1} + 0.15 \cdot \text{Baseline} + \Delta_{\text{random}}$) tailored across 4 distinct environmental zones (*Urban Core, Industrial Park, Forest Reserve, Coastal Basin*).
  * 4 interactive "What-If" hazard scenarios (`HEATWAVE`, `INDUSTRIAL_EMISSION`, `RAIN_CLEANSING`, `NORMAL`) with intensity multipliers and automatic alert creation.

* **Module 5: Relational Persistence & Security Infrastructure** (*Garv Kumar*)
  * 3NF normalized relational schema managing users, stations, telemetry records, and hazard alerts.
  * Spring Data JPA entity mapping with high-performance composite indexing on `station_id` and `recorded_at`.
  * Resilient dual-database strategy via `DataSourceConfig.java` providing zero-config automatic failover to H2 in-memory storage.
  * Salted SHA-256 password hashing and role authorization protecting administrative operations.

---

## Database Architecture & Resiliency Strategy

The system implements a resilient database strategy that guarantees zero runtime interruption, accommodating both enterprise production deployments and standalone local evaluations.

### MySQL 8.0 (Production Relational Core)
* **Usage**: Persistent storage of user accounts, station registry, time-series telemetry records, and alert audit logs.
* **Schema Definition**: Authored in [`database/schema.sql`](file:///e:/digital%20twin%20system/database/schema.sql) with utf8mb4 encoding, foreign keys, and default values.
* **Indexing Strategy**: Time-series B-Tree composite indexes on `(station_id, recorded_at DESC)` ensuring $O(\log N)$ retrieval for real-time dashboards and historical queries.

### In-Memory H2 Database (Zero-Config Automatic Fallback)
* **Usage**: Transparent failover engine activated automatically when MySQL Server is unreachable.
* **Implementation**: Managed by `DataSourceConfig.java`, which attempts a connection to MySQL on port 3306; upon connection timeout, it dynamically spins up an in-memory H2 database.
* **Auto-Seeding**: `DataInitializer.java` automatically seeds 6 default monitoring stations (`NODE-01` to `NODE-06`), initial telemetry history, and standard demo accounts on startup.

---

## Non-Functional Requirements

* **Performance**:
  * Sub-millisecond execution for spherical Haversine distance and compass bearing calculations.
  * Canvas rendering pipeline maintains a locked 60 FPS at native device pixel ratio (HiDPI/Retina display scaling) with sub-16ms frame times.
  * Dashboard polling payload resolves across all active stations in under 150ms.
* **Security**:
  * Passwords encrypted with salted SHA-256 before persistence; no plain-text credentials stored.
  * Role-Based Access Control guards administrative endpoints (station registration and hazard simulation).
  * Cross-Origin Resource Sharing (CORS) policy configured in `CorsConfig.java` to prevent unauthorized cross-domain exploitation.
* **Fault Tolerance & Resilience**:
  * Seamless database failover: Application starts and runs cleanly with or without a live MySQL instance.
  * Client-side geolocation fallback: Automatically provides predefined regional coordinates if the user denies GPS permissions or uses a browser without native GPS sensors.
* **Scalability & Code Quality**:
  * Decoupled layered architecture (Controller $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ Database).
  * Vanilla JavaScript frontend without heavy external UI frameworks ensures instant loading and zero build-step overhead.

---

## Week 3

---
### UML Design & System Modeling
---

### 1. UML Class Diagram (Domain Model & Services)

```mermaid
classDiagram
    direction TB

    class Station {
        -String id
        -String name
        -String zoneType
        -Double latitude
        -Double longitude
        -Double elevation
        -String state
        -String status
        -String description
        -LocalDateTime installedAt
        +getId() String
        +getName() String
        +getLatitude() Double
        +getLongitude() Double
        +getStatus() String
    }

    class TelemetryRecord {
        -Long id
        -String stationId
        -Integer aqi
        -Double pm25
        -Double pm10
        -Double temperature
        -Double humidity
        -Double co2
        -Double noiseDb
        -Double uvIndex
        -Double windSpeed
        -String windDirection
        -String statusSummary
        -LocalDateTime recordedAt
        +getId() Long
        +getStationId() String
        +getAqi() Integer
        +getTemperature() Double
    }

    class EnvironmentalAlert {
        -Long id
        -String stationId
        -String severity
        -String category
        -String title
        -String message
        -Boolean acknowledged
        -LocalDateTime triggeredAt
        +getId() Long
        +getSeverity() String
        +isAcknowledged() Boolean
        +acknowledge() void
    }

    class User {
        -Long id
        -String username
        -String email
        -String passwordHash
        -String role
        -Double lastLatitude
        -Double lastLongitude
        -LocalDateTime createdAt
        +getId() Long
        +getUsername() String
        +getRole() String
    }

    class StationService {
        -StationRepository stationRepository
        +getAllStations() List~Station~
        +getStationById(String id) Station
        +findNearestStation(Double lat, Double lng) NearestStationResponse
        +calculateHaversine(lat1, lon1, lat2, lon2) double
        +calculateBearing(lat1, lon1, lat2, lon2) double
        +getCardinalDirection(double degrees) String
    }

    class TelemetryService {
        -TelemetryRecordRepository telemetryRepo
        -EnvironmentalAlertRepository alertRepo
        +generateHeartbeatTelemetry() void
        +getLatestTelemetry() List~TelemetryDTO~
        +triggerSimulation(SimulationRequest req) void
        +checkSafetyThresholds(TelemetryRecord record) void
    }

    class AuthService {
        -UserRepository userRepository
        +login(LoginRequest req) AuthResponse
        +register(RegisterRequest req) AuthResponse
        +hashPassword(String password) String
    }

    Station "1" --> "0..*" TelemetryRecord : records
    Station "1" --> "0..*" EnvironmentalAlert : triggers
    StationService ..> Station : manages
    TelemetryService ..> TelemetryRecord : persists
    TelemetryService ..> EnvironmentalAlert : generates
    AuthService ..> User : authenticates
```

---

### 2. UML Sequence Diagram (GPS Pairing & Geodesic Ray Cast Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Operator
    participant UI as Dashboard UI (location.js)
    participant BrowserGPS as W3C Geolocation API
    participant API as StationController
    participant Service as StationService
    participant Repo as StationRepository
    participant Canvas as 2.5D Engine (twin-canvas.js)

    User->>UI: Click "Enable Location" / Select Zone Preset
    UI->>BrowserGPS: navigator.geolocation.getCurrentPosition()
    BrowserGPS-->>UI: Return Coordinates (Lat, Lng)
    UI->>API: GET /api/stations/nearest?lat={lat}&lng={lng}
    API->>Service: findNearestStation(lat, lng)
    Service->>Repo: findAll()
    Repo-->>Service: List of active stations
    loop For each station node
        Service->>Service: Compute Haversine Distance (d = 2R · arcsin(...))
        Service->>Service: Compute Forward Azimuth Bearing (θ = atan2(...))
    end
    Service->>Service: Filter Minimum Distance Node & Map Cardinal Direction
    Service-->>API: NearestStationResponse (id, name, distanceKm, bearing, coords)
    API-->>UI: HTTP 200 OK (JSON)
    UI->>Canvas: Dispatch stationSelected & Coordinates
    Canvas->>Canvas: Compute Screen Projection X, Y
    Canvas->>User: Animate Geodesic Laser Beam to Target Beacon
```

---

### 3. UML Sequence Diagram (Telemetry Heartbeat & What-If Hazard Scenario Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Lead Operator / Admin
    participant UI as Command Center UI (app.js)
    participant SimAPI as SimulationController
    participant TelService as TelemetryService
    participant Heartbeat as Spring @Scheduled (6s)
    participant TelRepo as TelemetryRecordRepository
    participant AlertRepo as EnvironmentalAlertRepository
    participant DB as MySQL / H2 Failover

    Heartbeat->>TelService: generateHeartbeatTelemetry()
    TelService->>TelService: Apply Weighted Smooth Random Walk
    TelService->>TelRepo: save(telemetryRecord)
    TelRepo->>DB: INSERT into telemetry_records
    TelService->>TelService: checkSafetyThresholds(record)
    
    opt When Disaster Scenario Injected
        Operator->>UI: Trigger Scenario (e.g., INDUSTRIAL_EMISSION)
        UI->>SimAPI: POST /api/simulation/trigger {scenario, multiplier}
        SimAPI->>TelService: triggerSimulation(req)
        TelService->>TelService: Apply Surge Multiplier (AQI >= 250, PM2.5 >= 150)
        TelService->>AlertRepo: save(environmentalAlert)
        AlertRepo->>DB: INSERT into environmental_alerts
        TelService-->>SimAPI: Simulation Active
        SimAPI-->>UI: HTTP 200 OK
        UI->>UI: Flash Hazard Banner & Play Audio Alert
    end
```

---

### 4. UML Use Case Diagram (Actor Roles & System Boundaries)

```mermaid
graph LR
    subgraph Actors ["Platform Actors"]
        Admin(("👑 System Admin"))
        Op(("🛡️ Lead Operator"))
        Res(("🔬 Researcher"))
        Cit(("🌿 Public Citizen"))
    end

    subgraph SystemBoundary ["AETHERIS Digital Environment Twin System"]
        UC1(["🔐 Unified Gateway Authentication"])
        UC2(["🌐 2.5D Canvas Lidar Monitoring"])
        UC3(["🛰️ Tactical Aerospace HUD Stream"])
        UC4(["📍 GPS Location Pairing Radar"])
        UC5(["⚡ Inject 'What-If' Disaster Scenarios"])
        UC6(["⚠️ Acknowledge Critical Hazard Alerts"])
        UC7(["➕ Register & Provision Virtual Nodes"])
        UC8(["📊 Export ISO 14001 ESG Audit"])
        UC9(["🌿 Clean Air Score & Health Verdict"])
        UC10(["💳 Indian GST Subscription Checkout"])
    end

    Admin --> UC1
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7

    Op --> UC1
    Op --> UC2
    Op --> UC3
    Op --> UC5
    Op --> UC6

    Res --> UC1
    Res --> UC2
    Res --> UC8

    Cit --> UC2
    Cit --> UC4
    Cit --> UC9
    Cit --> UC10
```

---

### 5. UML State Machine Diagram (Hazard Alert & Station Health Lifecycle)

```mermaid
stateDiagram-v2
    [*] --> OFFLINE: Physical Node Deployed
    OFFLINE --> ACTIVE: DataInitializer / Provisioned
    
    state ACTIVE {
        [*] --> NOMINAL: AQI < 100 & Temp < 32°C
        NOMINAL --> ELEVATED: AQI 100-199 or Temp >= 35°C
        ELEVATED --> HAZARD: AQI >= 250 or Temp >= 38°C
        HAZARD --> ACKNOWLEDGED: Operator Resolves (/acknowledge)
        ACKNOWLEDGED --> NOMINAL: Rain Cleansing / Normalized
        ELEVATED --> NOMINAL: Dispersion Factor Recovery
    }

    ACTIVE --> MAINTENANCE: Node Recalibration
    MAINTENANCE --> ACTIVE: Diagnostics Complete
    ACTIVE --> [*]: Station Decommissioned
```

---

### 6. Entity-Relationship (ER) Diagram (3NF Normalized Relational Schema)

```mermaid
erDiagram
    STATIONS ||--o{ TELEMETRY_RECORDS : "generates periodic (1:N)"
    STATIONS ||--o{ ENVIRONMENTAL_ALERTS : "triggers threshold (1:N)"
    USERS ||--o{ ENVIRONMENTAL_ALERTS : "acknowledges (1:N)"

    STATIONS {
        string id PK "Station Identifier e.g. NODE-METRO-01"
        string name "Human-Readable Station Name"
        string state "State/Territory (Indexed for Region Filtering)"
        string zone_type "URBAN_CORE, INDUSTRIAL_PARK, FOREST_RESERVE, COASTAL_BASIN"
        double latitude "WGS-84 Decimal Latitude"
        double longitude "WGS-84 Decimal Longitude"
        double elevation "Elevation Above Ground Level (meters)"
        string status "ACTIVE, MAINTENANCE, OFFLINE"
        timestamp installed_at "Installation & Calibration Timestamp"
    }

    TELEMETRY_RECORDS {
        bigint id PK "Auto Increment Primary Key"
        string station_id FK "Foreign Key References STATIONS.id"
        int aqi "Air Quality Index (0-500 scale)"
        double pm25 "Fine Particulate Matter (µg/m³)"
        double pm10 "Coarse Particulate Matter (µg/m³)"
        double temperature "Ambient Air Temperature (°C)"
        double humidity "Relative Humidity (%)"
        double co2 "Carbon Dioxide Concentration (ppm)"
        double noise_db "Ambient Acoustic Noise (dB)"
        double uv_index "Solar Ultraviolet Index (0-12)"
        double wind_speed "Atmospheric Wind Velocity (km/h)"
        string wind_direction "16-Point Compass Cardinal Heading"
        string status_summary "Plain-English Health Verdict"
        timestamp recorded_at "Record Timestamp (Composite B-Tree Indexed)"
    }

    ENVIRONMENTAL_ALERTS {
        bigint id PK "Auto Increment Primary Key"
        string station_id FK "Foreign Key References STATIONS.id"
        string severity "INFO, WARNING, CRITICAL, HAZARD"
        string category "AIR_QUALITY, HEAT_STRESS, CO2_SPIKE"
        string title "Concise Hazard Advisory Title"
        string message "Detailed Operational Guidelines"
        boolean acknowledged "Operator Acknowledgment Status Flag"
        timestamp triggered_at "Alert Trigger Timestamp"
    }

    USERS {
        bigint id PK "Auto Increment Primary Key"
        string username UK "Unique Alphanumeric Username"
        string email UK "Unique Corporate/Academic Email Address"
        string password_hash "Cryptographic Salted SHA-256 Hash"
        string role "ROLE_ADMIN, ROLE_OPERATOR, ROLE_RESEARCHER, ROLE_GUEST"
        double last_latitude "Last Reported Device Latitude"
        double last_longitude "Last Reported Device Longitude"
        timestamp created_at "User Registration Timestamp"
    }
```

---

## 🚀 Quick Start & Local Server Execution

The AETHERIS Digital Environment Twin supports two flexible local deployment modes: full-stack execution with Spring Boot, or instant standalone frontend execution.

### Method A: Full-Stack Spring Boot Local Server (Recommended)
This runs the complete Spring Boot 3.3.5 backend (REST APIs, JPA repositories, H2/MySQL failover) and simultaneously serves the frontend on port `9090`:

```powershell
# 1. Navigate to backend directory
cd "e:\digital twin system\backend"

# 2. Run with Maven Wrapper (Requires Java 17+)
.\mvnw.cmd spring-boot:run
```

- **Local Application URL:** **`http://localhost:9090`**
- **H2 In-Memory Console (if MySQL is offline):** **`http://localhost:9090/h2-console`**
- **REST API Base URL:** **`http://localhost:9090/api`**

### Method B: Standalone Frontend Local Server (Zero Setup / Instant)
The frontend is architected as zero-dependency vanilla web technology with a built-in fallback simulation engine. You can run it instantly using any lightweight HTTP server:

```powershell
# Navigate to frontend directory
cd "e:\digital twin system\frontend"

# Option 1: Python Built-in HTTP Server
python -m http.server 5500

# Option 2: Node.js npx serve
npx serve -l 5500

# Option 3: PHP Built-in Server
php -S localhost:5500
```

- **Local URL:** **`http://localhost:5500`** (or right-click `index.html` in VS Code and select **Open with Live Server**).
- When running standalone, all 4 platform views, 2.5D Canvas Lidar simulation, audio telemetry, and GST invoicing operate with continuous real-time mathematical simulation.

---

### 🔑 Default Credentials & Role-Based Access

| Role | Username / Email | Password | Access Privileges |
|---|---|---|---|
| **System Administrator** | `admin` / `admin@twin.env` | `admin123` | Full sensor node provisioning, global disaster scenario injection |
| **Lead Operator** | `operator` / `operator@twin.env` | `operator123` | Emergency simulation drills, safety threshold alert acknowledgement |
| **Environmental Researcher** | `researcher` / `research@twin.env` | `research123` | Time-series historical data pagination, ISO 14001 compliance export |
| **Citizen / Public Guest** | Unauthenticated | N/A | Nearest station GPS pairing, Clean Air score, plain-English health advice |

---

## ⚡ New Next-Gen Platform Features (Recent Updates)

### 1. 🛰️ Tactical Aerospace Telemetry HUD Strip (`frontend/js/tactical-hud.js`)
- **Dual Precision Mission Clock:** Synchronous UTC (`UTC 00:00:00.000`) and Local time with continuous microsecond ticker (`.000µs`).
- **Live Performance Counters:** Dynamic `60.0 FPS NOMINAL` frame rate watcher and telemetry stream monitor (`2.8 GB/S • AES-GCM`).
- **Synthesized Web Audio SFX:** Real-time Web Audio API frequency oscillator (`🔊 HUD AUDIO: ON/OFF`) producing tactical interface beeps on button clicks and mode changes.
- **Orbital Cyber Matrix Mode:** Instant toggle (`⚡ MATRIX MODE`) that renders CRT-style scanlines, high-contrast cyan glowing borders, and tactical aerospace corner brackets (`[ ]`).

### 2. 🌐 Advanced 2.5D Canvas Engine Upgrades (`frontend/js/twin-canvas.js`)
- **Orbital Lidar Laser Scanner:** High-intensity cyan laser beam sweeping diagonally across the 2.5D terrain grid, illuminating atmospheric particles.
- **Aerodynamic Vector Streamlines:** Fluid wind flow field with particle velocity streaks and boundary wrapping.
- **Targeting Reticle HUD:** Multi-segmented rotating target lock around active nodes with bearing degree ticks and floating coordinate readouts.
- **Compass Rose Azimuth HUD:** Top-right aerospace display showing magnetic heading (`HDG: 042° NE`), altitude (`ALT: +210M AGL`), and barometric pressure (`BARO: 1013.2 hPa`).
- **Interactive Mouse Crosshairs:** Real-time crosshair guides tracking cursor coordinates across the terrain matrix.

### 3. 🔐 Unified Single Security Gateway Login (`frontend/js/auth.js`)
- **Consolidated Entry Point:** Eliminated duplicate login modals in favor of a single unified Security Gateway (`#viewLoginGateway`).
- **Active Session Switcher:** Authenticated users see their active credentials, role badge, and one-click quick jump links to the **Citizen Dashboard** or **Advanced Twin Core**.

### 4. 🗺️ 4-View Architecture & Interactive Platform Directory (`frontend/js/product.js`)
- Standardized into 4 primary views accessible via the top navigation switcher:
  1. `login`: Unified Security Gateway & Session Switcher
  2. `citizen`: Citizen Health Advisories, Clean Air Dial & Outdoor Activity Verdicts
  3. `advanced`: 2.5D Digital Twin Engineering Core with 8 Live KPI Gauges
  4. `landing`: SaaS Product Showcase, Use Case Matrix & Pricing
- **Site Directory Modal (`🧭 Site Directory`)**: Interactive architectural guide explaining all 4 modules with one-click navigation.
- **Platform Directory Banner**: Multi-card orientation deck embedded atop the Citizen Dashboard.

### 5. 💳 Business Subscription & 18% GST Invoicing (`frontend/js/product.js`)
- **Indian Pricing Tiers:** `Smart Business Pro` (₹299/month annual / ₹399 monthly) & `Metropolis Sovereign` (₹999/month annual / ₹1,299 monthly).
- **Automated GST Tax Invoicing:** Live tax breakdown with Base Value, CGST (9%), SGST (9%), IGST (18%), and 100% GSTR-3B Input Tax Credit (ITC) savings callout.
- **Multi-Channel Corporate Payment:** Support for UPI (Instant QR & VPA), Corporate Net Banking, Business Cards, and GeM / NEFT / RTGS.
- **Printable Tax Invoices:** Instant generation of official tax invoice PDF format with unique license keys and allocated node quotas.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user credentials and issue role session |
| `POST` | `/api/auth/register` | Register new user account with SHA-256 password hash |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile |
| `GET` | `/api/stations` | Retrieve all active and virtual monitoring stations |
| `GET` | `/api/stations/{id}` | Inspect single station details and baseline parameters |
| `POST` | `/api/stations` | Register new physical or virtual sensor node |
| `GET` | `/api/stations/nearest?lat={lat}&lng={lng}` | Haversine distance, forward azimuth, and nearest station pairing |
| `GET` | `/api/telemetry/live` | Stream live telemetry across all active stations |
| `GET` | `/api/telemetry/history/{stationId}` | Fetch historical time-series telemetry records |
| `POST` | `/api/simulation/trigger` | Inject disaster scenario (`HEATWAVE`, `INDUSTRIAL_EMISSION`, `RAIN_CLEANSING`, `NORMAL`) |
| `GET` | `/api/alerts` | Fetch threshold hazard alerts (`?unacknowledgedOnly=true`) |
| `POST` | `/api/alerts/{id}/acknowledge` | Acknowledge active hazard alert |

---

## 📁 Project Directory Structure

```text
digital twin system/
├── database/
│   └── schema.sql                  # 3NF MySQL relational schema & index definitions
├── frontend/                       # Client Web Application
│   ├── index.html                  # Master HTML5 template with 4-View architecture
│   ├── css/
│   │   └── style.css               # Cybernetic glassmorphism, HUD brackets & scanline styling
│   └── js/
│       ├── app.js                  # Main application orchestrator & 5s polling loop
│       ├── auth.js                 # Unified Single Security Gateway & session manager
│       ├── location.js             # GPS pairing radar popup & coordinate helpers
│       ├── twin-canvas.js          # 2.5D Canvas, Lidar laser scanner & aerodynamic streamlines
│       ├── charts.js               # Lightweight cubic Bézier spline curve charting
│       ├── product.js              # Citizen portal, SaaS showcase, directory & GST billing
│       └── tactical-hud.js         # Aerospace telemetry HUD strip, mission clock & Web Audio SFX
├── backend/                        # Java Spring Boot 3.3.5 Backend Service
│   ├── pom.xml                     # Maven project configuration & dependencies
│   ├── mvnw.cmd                    # Maven wrapper executable (Windows)
│   ├── mvnw                        # Maven wrapper executable (Linux/macOS)
│   └── src/main/
│       ├── java/com/digitaltwin/environment/
│       │   ├── EnvironmentTwinApplication.java
│       │   ├── config/             # CORS, DataInitializer, SecurityHelper, DataSourceConfig
│       │   ├── model/              # Station, TelemetryRecord, EnvironmentalAlert, User
│       │   ├── repository/         # Spring Data JPA repositories
│       │   ├── dto/                # Auth, Telemetry, Simulation, NearestStation DTOs
│       │   ├── service/            # StationService, TelemetryService, AuthService
│       │   └── controller/         # Station, Telemetry, Simulation, Alert, Auth Controllers
│       └── resources/
│           ├── application.properties
│           └── static/             # Static frontend distribution served by Spring Boot
├── MEMBER_WISE_GITHUB_COMMITS.md   # Step-by-step GitHub push and PR guide for all 5 members
├── WEEK_1_MEMBER_BREAKDOWN.md      # Week 1 architectural planning & research specs
├── WEEK_2_MEMBER_BREAKDOWN.md      # Week 2 module implementation breakdown
├── WEEK_3_MEMBER_BREAKDOWN.md      # Week 3 testing, verification & deployment breakdown
└── README.md                       # Comprehensive Project Documentation
```
