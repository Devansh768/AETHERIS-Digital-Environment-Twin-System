package com.digitaltwin.environment.dto;

import java.time.LocalDateTime;

public class TelemetryDTO {
    private String stationId;
    private String stationName;
    private String state;
    private String zoneType;
    private Double latitude;
    private Double longitude;
    private Double elevation;
    private String status;
    private Integer aqi;
    private Double pm25;
    private Double pm10;
    private Double temperature;
    private Double humidity;
    private Double co2;
    private Double noiseDb;
    private Double uvIndex;
    private Double windSpeed;
    private String windDirection;
    private String statusSummary;
    private String aqiCategory; // Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous
    private String aqiColor;    // Hex color code for UI
    private LocalDateTime recordedAt;

    public TelemetryDTO() {}

    public static String calculateAqiCategory(int aqi) {
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Unhealthy for Sensitive Groups";
        if (aqi <= 200) return "Unhealthy";
        if (aqi <= 300) return "Very Unhealthy";
        return "Hazardous";
    }

    public static String calculateAqiColor(int aqi) {
        if (aqi <= 50) return "#10b981"; // Emerald green
        if (aqi <= 100) return "#f59e0b"; // Amber
        if (aqi <= 150) return "#f97316"; // Orange
        if (aqi <= 200) return "#ef4444"; // Red
        if (aqi <= 300) return "#8b5cf6"; // Purple
        return "#7f1d1d"; // Maroon
    }

    // Getters and setters
    public String getStationId() { return stationId; }
    public void setStationId(String stationId) { this.stationId = stationId; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

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

    public Integer getAqi() { return aqi; }
    public void setAqi(Integer aqi) {
        this.aqi = aqi;
        this.aqiCategory = calculateAqiCategory(aqi != null ? aqi : 0);
        this.aqiColor = calculateAqiColor(aqi != null ? aqi : 0);
    }

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

    public String getAqiCategory() { return aqiCategory; }
    public void setAqiCategory(String aqiCategory) { this.aqiCategory = aqiCategory; }

    public String getAqiColor() { return aqiColor; }
    public void setAqiColor(String aqiColor) { this.aqiColor = aqiColor; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
