package com.digitaltwin.environment.dto;

public class NearestStationResponse {
    private Double userLatitude;
    private Double userLongitude;
    private Double distanceKm;
    private String distanceFormatted;
    private Double bearingDegrees;
    private String cardinalDirection;
    private TelemetryDTO stationTelemetry;
    private String microclimateAssessment;

    public NearestStationResponse() {}

    public Double getUserLatitude() { return userLatitude; }
    public void setUserLatitude(Double userLatitude) { this.userLatitude = userLatitude; }

    public Double getUserLongitude() { return userLongitude; }
    public void setUserLongitude(Double userLongitude) { this.userLongitude = userLongitude; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public String getDistanceFormatted() { return distanceFormatted; }
    public void setDistanceFormatted(String distanceFormatted) { this.distanceFormatted = distanceFormatted; }

    public Double getBearingDegrees() { return bearingDegrees; }
    public void setBearingDegrees(Double bearingDegrees) { this.bearingDegrees = bearingDegrees; }

    public String getCardinalDirection() { return cardinalDirection; }
    public void setCardinalDirection(String cardinalDirection) { this.cardinalDirection = cardinalDirection; }

    public TelemetryDTO getStationTelemetry() { return stationTelemetry; }
    public void setStationTelemetry(TelemetryDTO stationTelemetry) { this.stationTelemetry = stationTelemetry; }

    public String getMicroclimateAssessment() { return microclimateAssessment; }
    public void setMicroclimateAssessment(String microclimateAssessment) { this.microclimateAssessment = microclimateAssessment; }
}
