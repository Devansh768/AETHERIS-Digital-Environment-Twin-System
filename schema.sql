-- ==========================================================
-- DIGITAL ENVIRONMENT TWIN SYSTEM
-- MySQL Database Schema & Seed Data
-- ==========================================================

CREATE DATABASE IF NOT EXISTS digital_twin_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE digital_twin_db;

-- ----------------------------------------------------------
-- 1. Table: users
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'OPERATOR',
    last_latitude DOUBLE,
    last_longitude DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. Table: stations (Physical / Digital Sensor Nodes)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Delhi NCR',
    zone_type VARCHAR(50) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    elevation DOUBLE DEFAULT 25.0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    description VARCHAR(255),
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. Table: telemetry_records (Time-series Environmental Data)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS telemetry_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    station_id VARCHAR(50) NOT NULL,
    aqi INT NOT NULL,
    pm25 DOUBLE NOT NULL,
    pm10 DOUBLE NOT NULL,
    temperature DOUBLE NOT NULL,
    humidity DOUBLE NOT NULL,
    co2 DOUBLE NOT NULL,
    noise_db DOUBLE NOT NULL,
    uv_index DOUBLE NOT NULL,
    wind_speed DOUBLE NOT NULL,
    wind_direction VARCHAR(20) DEFAULT 'NE',
    status_summary VARCHAR(50) DEFAULT 'Normal',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_station_recorded (station_id, recorded_at),
    CONSTRAINT fk_telemetry_station FOREIGN KEY (station_id) 
        REFERENCES stations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. Table: environmental_alerts (Hazard Threshold Breaches)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS environmental_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    station_id VARCHAR(50),
    severity VARCHAR(20) NOT NULL, -- INFO, WARNING, CRITICAL, HAZARD
    category VARCHAR(50) NOT NULL, -- AIR_QUALITY, TEMPERATURE, CO2, NOISE
    title VARCHAR(120) NOT NULL,
    message VARCHAR(255) NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alert_station FOREIGN KEY (station_id) 
        REFERENCES stations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Initial Seed Data
-- ----------------------------------------------------------

-- Default Admin and Operator users (password hashes compatible with our SHA-256 / BCrypt auth)
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES 
('admin', 'admin@twin.env', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'System Administrator', 'ADMIN'),
('operator', 'operator@twin.env', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Lead Environmental Engineer', 'OPERATOR')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 5 Real-world Digital Twin Monitoring Nodes
INSERT INTO stations (id, name, zone_type, latitude, longitude, elevation, status, description)
VALUES
('NODE-METRO-01', 'Metro Central Hub Station', 'URBAN_CORE', 28.6139, 77.2090, 216.0, 'ACTIVE', 'High-density urban intersection with heavy vehicular traffic monitoring'),
('NODE-INDUS-02', 'Industrial Sector 62 Park', 'INDUSTRIAL_PARK', 28.5355, 77.3910, 198.0, 'ACTIVE', 'Manufacturing and thermal exhaust dispersion sensor cluster'),
('NODE-FOREST-03', 'North Ridge Botanical Bio-Reserve', 'FOREST_RESERVE', 28.6850, 77.2150, 235.0, 'ACTIVE', 'Biodiversity baseline and carbon absorption reference node'),
('NODE-VALLEY-04', 'Greenfield Suburban Microclimate', 'SUBURBAN_VALLEY', 28.4595, 77.0266, 220.0, 'ACTIVE', 'Residential residential zone with localized microclimate weather sensing'),
('NODE-COAST-05', 'Riverside Basin Wetland Station', 'COASTAL_BASIN', 28.6400, 77.2600, 205.0, 'ACTIVE', 'Riverine humidity, atmospheric dispersion, and cooling effect station')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed initial telemetry samples
INSERT INTO telemetry_records (station_id, aqi, pm25, pm10, temperature, humidity, co2, noise_db, uv_index, wind_speed, wind_direction, status_summary)
VALUES
('NODE-METRO-01', 142, 62.4, 118.0, 29.5, 48.0, 540.0, 68.5, 6.2, 7.5, 'NW', 'Moderate Air Quality'),
('NODE-INDUS-02', 215, 110.8, 185.0, 32.8, 42.0, 720.0, 74.2, 5.8, 4.2, 'N', 'Unhealthy Air Quality'),
('NODE-FOREST-03', 46, 12.3, 28.0, 24.2, 68.0, 395.0, 41.0, 4.5, 6.8, 'NE', 'Good (Pristine)'),
('NODE-VALLEY-04', 85, 34.1, 62.0, 27.1, 54.0, 460.0, 52.0, 6.0, 8.2, 'W', 'Satisfactory'),
('NODE-COAST-05', 92, 38.6, 71.0, 26.4, 72.0, 430.0, 49.0, 5.5, 11.4, 'E', 'Satisfactory');

-- Seed initial alerts
INSERT INTO environmental_alerts (station_id, severity, category, title, message)
VALUES
('NODE-INDUS-02', 'CRITICAL', 'AIR_QUALITY', 'Particulate AQI Spike Warning', 'PM2.5 exceeds permissible threshold (110.8 ug/m3). Industrial exhaust scrubbing recommended.'),
('NODE-METRO-01', 'WARNING', 'NOISE', 'Acoustic Pollution Advisory', 'Traffic noise reached sustained peak of 68.5 dB during rush hours.');
