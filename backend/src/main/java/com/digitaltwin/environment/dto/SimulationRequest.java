package com.digitaltwin.environment.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

public class SimulationRequest {
    @Pattern(regexp = "^(?i)(ALL|[A-Z0-9][A-Z0-9_-]{0,49})$", message = "must be ALL or a valid station ID")
    private String stationId; // "ALL" or specific station ID

    @Pattern(
            regexp = "^(?i)(HEATWAVE|INDUSTRIAL_EMISSION|RAIN_CLEANSING|STORM_FRONT|NORMAL)$",
            message = "must be HEATWAVE, INDUSTRIAL_EMISSION, RAIN_CLEANSING, STORM_FRONT, or NORMAL")
    private String scenario; // HEATWAVE, INDUSTRIAL_EMISSION, RAIN_CLEANSING, STORM_FRONT, NORMAL

    @DecimalMin(value = "0.5", message = "must be at least 0.5")
    @DecimalMax(value = "2.5", message = "must be at most 2.5")
    private Double intensity = 1.0; // 0.5 to 2.5 multiplier

    @Min(value = 1, message = "must be at least 1 minute")
    private Integer durationMinutes = 30;

    public SimulationRequest() {}

    public String getStationId() { return stationId; }
    public void setStationId(String stationId) { this.stationId = stationId; }

    public String getScenario() { return scenario; }
    public void setScenario(String scenario) { this.scenario = scenario; }

    public Double getIntensity() { return intensity; }
    public void setIntensity(Double intensity) { this.intensity = intensity; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}
