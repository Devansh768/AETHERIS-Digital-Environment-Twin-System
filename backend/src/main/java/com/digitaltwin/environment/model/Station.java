package com.digitaltwin.environment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stations")
public class Station {

    @Id
    @Column(length = 50)
    private String id; // e.g. NODE-METRO-01

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "zone_type", nullable = false, length = 50)
    private String zoneType; // URBAN_CORE, INDUSTRIAL_PARK, FOREST_RESERVE, SUBURBAN_VALLEY, COASTAL_BASIN

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Double elevation = 25.0;

    @Column(length = 100)
    private String state = "Delhi NCR";

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, MAINTENANCE, OFFLINE

    private String description;

    @Column(name = "installed_at")
    private LocalDateTime installedAt = LocalDateTime.now();

    public Station() {}

    public Station(String id, String name, String state, String zoneType, Double latitude, Double longitude, Double elevation, String status, String description) {
        this.id = id;
        this.name = name;
        this.state = (state != null && !state.isBlank()) ? state : "Delhi NCR";
        this.zoneType = zoneType;
        this.latitude = latitude;
        this.longitude = longitude;
        this.elevation = elevation;
        this.status = status;
        this.description = description;
        this.installedAt = LocalDateTime.now();
    }

    public Station(String id, String name, String zoneType, Double latitude, Double longitude, Double elevation, String status, String description) {
        this(id, name, "Delhi NCR", zoneType, latitude, longitude, elevation, status, description);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZoneType() { return zoneType; }
    public void setZoneType(String zoneType) { this.zoneType = zoneType; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getElevation() { return elevation; }
    public void setElevation(Double elevation) { this.elevation = elevation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getInstalledAt() { return installedAt; }
    public void setInstalledAt(LocalDateTime installedAt) { this.installedAt = installedAt; }
}
