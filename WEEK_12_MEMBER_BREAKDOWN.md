# Week 12: Validation, Hardening, Documentation & Viva Readiness (September 21 – October 6, 2026)
## AETHERIS — Real-Time 2.5D Digital Environment Twin System

---

## 📌 Executive Summary
Week 12 represents the comprehensive culmination of Stage 5 (Validation, Hardening & Deployment): executing rigorous precision benchmarking and boundary testing on the Haversine geospatial proximity algorithm against GIS baselines, conducting Chrome DevTools performance profiling on the 2.5D Canvas engine to guarantee sustained 60 FPS, performing cross-device layout stress testing and UI bug squashing, stress testing automated hazard simulation pipelines, optimizing database indexing and connection pool configurations, completing code refactoring with Javadocs, authoring comprehensive technical manuals and mathematical derivations, validating multi-environment deployment configurations, and preparing viva presentation defense assets with live demo walkthroughs.

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
* **Core Focus:** Canvas 60 FPS Optimization & Graphics Pipeline Documentation
* **Weekly Tasks:**
  * Profiled Canvas 2.5D rendering loop in Chrome DevTools Performance Profiler, ensuring stable 60 FPS without frame drops under continuous rendering cycles.
  * Optimized canvas context state saves/restores, cached radial gradient fills, and tuned cubic Bézier spline calculation overhead.
  * Resolved visual flickering and artifact edge cases during rapid window resizing and high-frequency multi-station halo pulsing.
  * Documented 2.5D isometric projection mathematics, depth sorting layer hierarchy, and Bézier interpolation pipelines in the project report.
  * Prepared visual viva demonstration assets and real-time graphics defense slides illustrating raycasting and hit-testing math.
* **Key Deliverable:** Canvas 60 FPS Optimization & Graphics Pipeline Documentation.

---

### 2. Dhruv Jain
* **Role / Domain:** Frontend UI/UX & Web Dashboard
* **Core Focus:** Cross-Device UI Hardening, Operating Manual & Live Demo Script
* **Weekly Tasks:**
  * Conducted comprehensive cross-device and multi-resolution UI stress testing across 4K, 1080p, tablet, and mobile viewports.
  * Polished modal transition animations, toast notifications, and metric card loading state transitions.
  * Squashed layout overflow edge cases, ensured WCAG color contrast standards, and achieved zero cumulative layout shift (CLS < 0.05).
  * Conducted final cross-browser validation across Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari.
  * Compiled comprehensive end-user walkthrough manual covering dashboard telemetry navigation, radar pairing, and alert acknowledgements.
  * Structured interactive viva demonstration flow and scripted guided operational scenarios for live evaluators.
* **Key Deliverable:** Cross-Device UI Hardening, Operating Manual & Live Demo Script.

---

### 3. Devansh Joshi
* **Role / Domain:** Backend Services & Geospatial Algorithms
* **Core Focus:** Geospatial Precision Benchmarking, Mathematical Derivations & Technical Defense Slides
* **Weekly Tasks:**
  * Executed precision benchmark tests comparing Haversine distance calculations against Google Maps Distance Matrix and GIS reference baselines.
  * Tested mathematical boundary conditions including crossing the Prime Meridian ($0^\circ$ longitude), international date line, and poles.
  * Verified numerical stability when testing antipodal coordinates and extremely close proximity points ($< 10\text{ meters}$).
  * Performed high-concurrency load testing on `/api/stations/nearest`, confirming sub-millisecond calculation response times and zero memory leaks.
  * Refactored `StationService.java` and `StationController.java`, standardizing Javadoc annotations, removing dead code, and organizing imports.
  * Authored comprehensive mathematical derivations of the Haversine spherical formula and forward azimuth bearing equations in technical project reports.
  * Finalized comprehensive API documentation for all `/api/stations/*` endpoints (request params, response schemas, error codes) in `README.md`.
  * Prepared technical defense slides covering spherical geometry trade-offs (Haversine vs. Vincenty) and coordinate system projections for the viva examination.
* **Key Deliverable:** Geospatial Precision Benchmarking, Mathematical Derivations & Technical Defense Slides.

---

### 4. Devansh Mittal
* **Role / Domain:** Backend Simulation & Automated Alerting
* **Core Focus:** Simulation Stress Testing, Matrix Documentation & Live Hazard Demo Scripts
* **Weekly Tasks:**
  * Conducted high-frequency stress testing on disaster simulation scenarios (*Heatwave, Smog Spike, Industrial Leak*).
  * Validated alert queue dispatch latency and verified unacknowledged alert persistence under concurrent threshold breaches.
  * Profiled JVM CPU and heap memory utilization during prolonged autonomous simulation cycles to verify zero memory leaks.
  * Refactored `TelemetryService.java`, `SimulationController.java`, and `AlertController.java` with comprehensive Javadoc documentation.
  * Documented autonomous simulation scenarios, environmental variance curves, and hazard threshold matrices in the technical report.
  * Prepared live disaster injection demonstration scripts (*Heatwave, Smog Spike, Industrial Leak*) for viva examiners.
* **Key Deliverable:** Simulation Stress Testing, Matrix Documentation & Live Hazard Demo Scripts.

---

### 5. Garv Kumar
* **Role / Domain:** Database Architecture & Security
* **Core Focus:** Database Optimization, 3NF ERD Documentation & Multi-Environment Deployment Guide
* **Weekly Tasks:**
  * Added performance database indexes on high-frequency query fields (`latitude`, `longitude`, `timestamp`, `station_id`).
  * Tuned HikariCP connection pool parameters and validated seamless failover between MySQL and H2 in-memory storage.
  * Performed security audits on all REST endpoints to verify unauthorized request rejections, CORS preflight validity, and token expiry handling.
  * Finalized database schema documentation, Entity-Relationship (ER) models, and third normal form (3NF) relational structures.
  * Documented polyglot dual-database failover architecture (MySQL with H2 in-memory fallback) and RBAC security policies.
  * Validated deployment configurations (`docker-compose.yml`, `render.yaml`, and standalone Spring Boot executable JAR).
* **Key Deliverable:** Database Optimization, 3NF ERD Documentation & Multi-Environment Deployment Guide.

---

## 📊 Summary Matrix

| Member | Module | Deliverable | Status |
| :--- | :--- | :--- | :---: |
| **Ishita Sinha** | Frontend Canvas & Computer Graphics | Canvas 60 FPS Optimization & Graphics Pipeline Documentation | ✅ Completed |
| **Dhruv Jain** | Frontend UI/UX & Web Dashboard | Cross-Device UI Hardening, Operating Manual & Live Demo Script | ✅ Completed |
| **Devansh Joshi** | Backend Services & Geospatial Math | Precision Benchmarking, Mathematical Derivations & Defense Slides | ✅ Completed |
| **Devansh Mittal** | Backend Simulation & Automated Alerting | Simulation Stress Testing, Matrix Docs & Live Hazard Demo Scripts | ✅ Completed |
| **Garv Kumar** | Database Architecture & Security | Database Optimization, 3NF ERD Docs & Deployment Guide | ✅ Completed |
