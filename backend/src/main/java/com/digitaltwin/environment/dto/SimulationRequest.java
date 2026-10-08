package com.digitaltwin.environment.dto;

public class SimulationRequest {
    private String stationId; // "ALL" or specific station ID
    private String scenario; // HEATWAVE, INDUSTRIAL_EMISSION, RAIN_CLEANSING, STORM_FRONT, NORMAL
    private Double intensity = 1.0; // 0.5 to 2.5 multiplier
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
