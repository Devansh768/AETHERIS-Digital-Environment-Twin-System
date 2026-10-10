# 🚀 Member-Wise GitHub Push & Pull Request (PR) Guide
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

This guide outlines the exact **file allocation**, **step-by-step Git commands**, **branch names**, **commit messages**, and **Pull Request (PR) templates** for each team member to push their module independently to GitHub without merge conflicts.

---

## 📌 Team Allocation Summary Table

| Member | Branch Name | Module / Domain | Core Files Owned |
| :--- | :--- | :--- | :--- |
| **Devansh Joshi** | `feature/geospatial-services` | Geospatial Algorithms & Location APIs | `StationService.java`, `StationController.java`, `NearestStationResponse.java`, `location.js` |
| **Ishita Sinha** | `feature/canvas-graphics` | 2.5D Graphics, Lidar & Canvas HUD | `twin-canvas.js`, `charts.js` |
| **Dhruv Jain** | `feature/ui-dashboard` | Command Center UI, SaaS Showcase & Directory | `index.html`, `style.css`, `app.js`, `product.js` |
| **Devansh Mittal** | `feature/simulation-alerting` | Hazard Scenarios & Tactical Aerospace HUD | `TelemetryService.java`, `SimulationController.java`, `TelemetryController.java`, `AlertController.java`, `SimulationRequest.java`, `TelemetryDTO.java`, `tactical-hud.js` |
| **Garv Kumar** | `feature/database-security` | 3NF DB Schema, JPA & Unified Gateway Auth | `schema.sql`, JPA Models, Repositories, `DataSourceConfig.java`, `AuthService.java`, `AuthController.java`, `auth.js` |

---

## 🛠️ Step 0: Initial Repository Setup (Project Lead / First Step)

Run this once in the root folder (`e:\digital twin system`) if the repository is not yet initialized:

```bash
# Navigate to the workspace root
cd "e:\digital twin system"

# Initialize Git
git init

# Configure user details (replace with your name and email)
git config user.name "Devansh Joshi"
git config user.email "devanshjoshi980@gmail.com"

# Set default branch to main
git branch -M main

# Add remote repository URL
git remote add origin https://github.com/Devansh768/AETHERIS-Digital-Environment-Twin-System.git

# Initial commit of base project files & documentation
git add README.md .gitignore MEMBER_WISE_GITHUB_COMMITS.md WEEK_1_MEMBER_BREAKDOWN.md WEEK_2_MEMBER_BREAKDOWN.md WEEK_3_MEMBER_BREAKDOWN.md
git commit -m "chore: initialize AETHERIS digital twin repository and architectural docs"
git push -u origin main
```

---

## 1️⃣ Devansh Joshi (Backend Services & Geospatial Algorithms)

### 📂 Files Owned:
```text
backend/src/main/java/com/digitaltwin/environment/service/StationService.java
backend/src/main/java/com/digitaltwin/environment/controller/StationController.java
backend/src/main/java/com/digitaltwin/environment/dto/NearestStationResponse.java
frontend/js/location.js
```

### 💻 Step-by-Step Git Commands:
```bash
# 1. Ensure you are on the updated main branch
git checkout main
git pull origin main

# 2. Create and switch to your feature branch
git checkout -b feature/geospatial-services

# 3. Stage only your assigned files
git add backend/src/main/java/com/digitaltwin/environment/service/StationService.java
git add backend/src/main/java/com/digitaltwin/environment/controller/StationController.java
git add backend/src/main/java/com/digitaltwin/environment/dto/NearestStationResponse.java
git add frontend/js/location.js

# 4. Commit with semantic message
git commit -m "feat(geospatial): implement Haversine spherical math, compass bearing, and nearest station radar APIs"

# 5. Push branch to GitHub
git push origin feature/geospatial-services
```

### 📝 Pull Request (PR) Details:
* **PR Title:** `[Devansh Joshi] Feature: Geospatial Proximity Engine, Haversine Distance & Station REST Endpoints`
* **PR Description:**
```markdown
### Summary of Changes:
- **Haversine Proximity Formula**: Implemented Great-Circle spherical distance calculation ($R = 6371\text{ km}$) in `StationService.java` to compute sub-10m client-to-station proximity.
- **Forward Azimuth Bearing**: Programmed 16-point cardinal compass classification (`N, NNE, NE, ENE...`) and angle normalization (0°–360°).
- **REST API Endpoints**: Exposed `GET /api/stations/nearest?lat={lat}&lng={lng}` and full station node CRUD in `StationController.java`.
- **Client Location Manager**: Built GPS radar pairing dialog and W3C Geolocation error handling in `frontend/js/location.js`.
```

---

## 2️⃣ Ishita Sinha (Frontend Canvas & Computer Graphics)

### 📂 Files Owned:
```text
frontend/js/twin-canvas.js
frontend/js/charts.js
```

### 💻 Step-by-Step Git Commands:
```bash
# 1. Update from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/canvas-graphics

# 3. Stage canvas and charting files
git add frontend/js/twin-canvas.js
git add frontend/js/charts.js

# 4. Commit
git commit -m "feat(canvas): build 2.5D isometric terrain, Lidar laser scanner, aerodynamic streamlines, and Bézier charts"

# 5. Push to GitHub
git push origin feature/canvas-graphics
```

### 📝 Pull Request (PR) Details:
* **PR Title:** `[Ishita Sinha] Feature: 2.5D Isometric Canvas Engine, Lidar Scanner & Bézier Spline Charting`
* **PR Description:**
```markdown
### Summary of Changes:
- **2.5D Canvas Pipeline**: Engineered locked 60 FPS HTML5 Canvas engine with Retina / HiDPI display scaling in `twin-canvas.js`.
- **Orbital Lidar Laser Scanner**: Built dynamic sweeping cyan laser beam that scans across terrain grid intersections and particles.
- **Aerodynamic Vector Streamlines**: Modeled fluid wind flow field with particle velocity streaks and boundary wrapping.
- **Aerospace Targeting Reticle**: Rendered multi-segmented rotating target lock reticle with bearing ticks and live coordinate tags.
- **Azimuth Compass & Telemetry HUD**: Embedded aerospace compass rose displaying live heading (`HDG: 042° NE`), altitude (`ALT: +210M`), and pressure.
- **Interactive Mouse Crosshairs**: Dynamic cursor-following crosshair with real-time `[X: Y:]` grid readouts.
- **Cubic Bézier Charting**: Developed zero-dependency spline curve engine in `charts.js` for smooth telemetry streams.
```

---

## 3️⃣ Dhruv Jain (Frontend UI/UX, SaaS Showcase & Platform Directory)

### 📂 Files Owned:
```text
frontend/index.html
frontend/css/style.css
frontend/js/app.js
frontend/js/product.js
```

### 💻 Step-by-Step Git Commands:
```bash
# 1. Update from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/ui-dashboard

# 3. Stage UI and product suite files
git add frontend/index.html
git add frontend/css/style.css
git add frontend/js/app.js
git add frontend/js/product.js

# 4. Commit
git commit -m "feat(ui): implement 4-view platform architecture, cybernetic glassmorphism, citizen portal, and platform directory"

# 5. Push to GitHub
git push origin feature/ui-dashboard
```

### 📝 Pull Request (PR) Details:
* **PR Title:** `[Dhruv Jain] Feature: Command Center UI, 4-View Architecture, Citizen Portal & Platform Directory`
* **PR Description:**
```markdown
### Summary of Changes:
- **4-View Architecture**: Structured complete view switching system across `Login Portal`, `Citizen Dashboard`, `Advanced Twin Core`, and `Product Showcase`.
- **Platform Directory Guide**: Built interactive Site Directory Modal and Citizen Dashboard Directory Banner with 1-click navigation across all modules.
- **Tactical Aerospace Brackets**: Implemented futuristic corner reticles (`[ ]`) on cards and panels that illuminate on hover.
- **Citizen Health Intelligence**: Developed Clean Air dial, health verdicts, and outdoor activity recommendations in `product.js`.
- **Executive Audit Exporter**: Added ISO 14001 / CPCB compliant environmental audit generator with PDF/print view.
- **Indian Pricing & GST Calculator**: Configured INR pricing (`₹299/mo Pro`, `₹999/mo Sovereign`) with 18% GST ITC tax calculation and multi-payment checkout.
```

---

## 4️⃣ Devansh Mittal (Backend Simulation & Tactical Aerospace HUD)

### 📂 Files Owned:
```text
backend/src/main/java/com/digitaltwin/environment/service/TelemetryService.java
backend/src/main/java/com/digitaltwin/environment/controller/SimulationController.java
backend/src/main/java/com/digitaltwin/environment/controller/TelemetryController.java
backend/src/main/java/com/digitaltwin/environment/controller/AlertController.java
backend/src/main/java/com/digitaltwin/environment/dto/SimulationRequest.java
backend/src/main/java/com/digitaltwin/environment/dto/TelemetryDTO.java
frontend/js/tactical-hud.js
```

### 💻 Step-by-Step Git Commands:
```bash
# 1. Update from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/simulation-alerting

# 3. Stage backend simulation and tactical HUD files
git add backend/src/main/java/com/digitaltwin/environment/service/TelemetryService.java
git add backend/src/main/java/com/digitaltwin/environment/controller/SimulationController.java
git add backend/src/main/java/com/digitaltwin/environment/controller/TelemetryController.java
git add backend/src/main/java/com/digitaltwin/environment/controller/AlertController.java
git add backend/src/main/java/com/digitaltwin/environment/dto/SimulationRequest.java
git add backend/src/main/java/com/digitaltwin/environment/dto/TelemetryDTO.java
git add frontend/js/tactical-hud.js

# 4. Commit
git commit -m "feat(simulation): build background telemetry heartbeat, What-If hazard engine, and aerospace tactical HUD"

# 5. Push to GitHub
git push origin feature/simulation-alerting
```

### 📝 Pull Request (PR) Details:
* **PR Title:** `[Devansh Mittal] Feature: Simulation Scenarios, Automated Alerting & Aerospace Tactical HUD`
* **PR Description:**
```markdown
### Summary of Changes:
- **Telemetry Heartbeat Engine**: Built Spring `@Scheduled(fixedRate = 6000)` background service generating dynamic telemetry records across 4 environmental zones.
- **What-If Hazard Scenarios**: Implemented mathematical injection algorithms for `HEATWAVE`, `INDUSTRIAL_EMISSION`, `RAIN_CLEANSING`, and `NORMAL` states.
- **Automated Alert Rules**: Configured threshold detection triggering alerts when AQI $\ge 250$ or Temp $\ge 38^\circ\text{C}$.
- **Aerospace Telemetry HUD Strip**: Developed `tactical-hud.js` providing dual UTC/Local mission clocks with microsecond precision, live FPS counters, and data stream indicators.
- **Web Audio Sound Synthesizer**: Programmed real-time Web Audio API frequency beeps and clicks with audio mute controls.
- **Holographic Matrix Mode**: Added cybernetic CRT-style scanline overlay and high-contrast matrix theme toggle.
```

---

## 5️⃣ Garv Kumar (Database Architecture, Security & Unified Gateway)

### 📂 Files Owned:
```text
database/schema.sql
backend/src/main/java/com/digitaltwin/environment/model/
backend/src/main/java/com/digitaltwin/environment/repository/
backend/src/main/java/com/digitaltwin/environment/config/
backend/src/main/java/com/digitaltwin/environment/service/AuthService.java
backend/src/main/java/com/digitaltwin/environment/controller/AuthController.java
frontend/js/auth.js
```

### 💻 Step-by-Step Git Commands:
```bash
# 1. Update from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/database-security

# 3. Stage database, JPA, security, and auth files
git add database/schema.sql
git add backend/src/main/java/com/digitaltwin/environment/model/
git add backend/src/main/java/com/digitaltwin/environment/repository/
git add backend/src/main/java/com/digitaltwin/environment/config/
git add backend/src/main/java/com/digitaltwin/environment/service/AuthService.java
git add backend/src/main/java/com/digitaltwin/environment/controller/AuthController.java
git add frontend/js/auth.js

# 4. Commit
git commit -m "feat(db-security): author 3NF relational schema, dual-database failover, and unified authentication gateway"

# 5. Push to GitHub
git push origin feature/database-security
```

### 📝 Pull Request (PR) Details:
* **PR Title:** `[Garv Kumar] Feature: 3NF Relational Database, In-Memory H2 Fallback & Unified Security Gateway`
* **PR Description:**
```markdown
### Summary of Changes:
- **3NF Relational Schema**: Designed `database/schema.sql` with B-Tree composite indexes on `station_id` and `recorded_at` for high-throughput time-series queries.
- **Dual-Database Resiliency**: Engineered automatic fallback in `DataSourceConfig.java` to an in-memory H2 database if MySQL 8.0 is unreachable.
- **Data Initializer**: Created `DataInitializer.java` to seed default stations and administrative accounts on boot.
- **Salted SHA-256 RBAC**: Secured authentication with salted cryptographic hashing and role guards (`ROLE_ADMIN`, `ROLE_OPERATOR`, `ROLE_RESEARCHER`).
- **Unified Security Gateway**: Refactored `frontend/js/auth.js` into a single full-page security gateway, eliminating duplicate modals and adding an active session switcher deck.
```

---

## 🔄 Recommended Pull Request Merge Order

To ensure clean, conflict-free integration on GitHub:

1. **Merge PR #1: Garv Kumar (`feature/database-security`)** — Establishes core DB entities, repositories, and authentication infrastructure.
2. **Merge PR #2: Devansh Joshi (`feature/geospatial-services`)** — Integrates Station services and Haversine distance calculations.
3. **Merge PR #3: Devansh Mittal (`feature/simulation-alerting`)** — Integrates background telemetry heartbeats, alert engine, and tactical HUD.
4. **Merge PR #4: Ishita Sinha (`feature/canvas-graphics`)** — Adds 2.5D canvas visualization, Lidar scanner, and Bézier curves.
5. **Merge PR #5: Dhruv Jain (`feature/ui-dashboard`)** — Connects master command center UI, product showcase, and directory guide.

---

## ✅ Post-Merge Verification Checklist

After all PRs are merged into `main`:

```bash
# Pull the latest consolidated code
git checkout main
git pull origin main

# Build and run the Spring Boot backend
cd backend
.\mvnw.cmd spring-boot:run

# Verify on browser
# Open: http://localhost:9090
```
- [x] Login Gateway loads as the primary authentication portal.
- [x] Tactical Telemetry HUD Strip ticks smoothly with live UTC clock and FPS counter.
- [x] 2.5D Canvas renders isometric terrain with sweeping Lidar scan beam.
- [x] GPS Location Pairing connects to nearest station via geodesic laser beam.
- [x] What-If simulation scenarios trigger live hazard alerts.
- [x] Citizen Dashboard and Product Showcase display complete platform directory and GST invoicing modal.
