package com.digitaltwin.environment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry_records")
public class TelemetryRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "station_id", nullable = false, length = 50)
    private String stationId;

    @Column(nullable = false)
    private Integer aqi;

    @Column(nullable = false)
    private Double pm25;

    @Column(nullable = false)
    private Double pm10;

    @Column(nullable = false)
    private Double temperature;

    @Column(nullable = false)
    private Double humidity;

    @Column(nullable = false)
    private Double co2;

    @Column(name = "noise_db", nullable = false)
    private Double noiseDb;

    @Column(name = "uv_index", nullable = false)
    private Double uvIndex;

    @Column(name = "wind_speed", nullable = false)
    private Double windSpeed;

    @Column(name = "wind_direction", length = 20)
    private String windDirection = "NE";

    @Column(name = "status_summary", length = 50)
    private String statusSummary = "Optimal";

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public TelemetryRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStationId() { return stationId; }
    public void setStationId(String stationId) { this.stationId = stationId; }

    public Integer getAqi() { return aqi; }
    public void setAqi(Integer aqi) { this.aqi = aqi; }

    public Double getPm25() { return pm25; }
    public void setPm25(Double pm25) { this.pm25 = pm25; }

    public Double getPm10() { return pm10; }
    public void setPm10(Double pm10) { this.pm10 = pm10; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public Double getCo2() { return co2; }
    public void setCo2(Double co2) { this.co2 = co2; }

    public Double getNoiseDb() { return noiseDb; }
    public void setNoiseDb(Double noiseDb) { this.noiseDb = noiseDb; }

    public Double getUvIndex() { return uvIndex; }
    public void setUvIndex(Double uvIndex) { this.uvIndex = uvIndex; }

    public Double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(Double windSpeed) { this.windSpeed = windSpeed; }

    public String getWindDirection() { return windDirection; }
    public void setWindDirection(String windDirection) { this.windDirection = windDirection; }

    public String getStatusSummary() { return statusSummary; }
    public void setStatusSummary(String statusSummary) { this.statusSummary = statusSummary; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
