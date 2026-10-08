package com.digitaltwin.environment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "environmental_alerts")
public class EnvironmentalAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "station_id", length = 50)
    private String stationId;

    @Column(nullable = false, length = 20)
    private String severity; // INFO, WARNING, CRITICAL, HAZARD

    @Column(nullable = false, length = 50)
    private String category; // AIR_QUALITY, HEAT_STRESS, CO2_SPIKE, NOISE

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 255)
    private String message;

    private Boolean acknowledged = false;

    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt = LocalDateTime.now();

    public EnvironmentalAlert() {}

    public EnvironmentalAlert(String stationId, String severity, String category, String title, String message) {
        this.stationId = stationId;
        this.severity = severity;
        this.category = category;
        this.title = title;
        this.message = message;
        this.acknowledged = false;
        this.triggeredAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStationId() { return stationId; }
    public void setStationId(String stationId) { this.stationId = stationId; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getAcknowledged() { return acknowledged; }
    public void setAcknowledged(Boolean acknowledged) { this.acknowledged = acknowledged; }

    public LocalDateTime getTriggeredAt() { return triggeredAt; }
    public void setTriggeredAt(LocalDateTime triggeredAt) { this.triggeredAt = triggeredAt; }
}
