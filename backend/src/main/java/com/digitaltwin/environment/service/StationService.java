package com.digitaltwin.environment.service;

import com.digitaltwin.environment.dto.NearestStationResponse;
import com.digitaltwin.environment.dto.TelemetryDTO;
import com.digitaltwin.environment.model.Station;
import com.digitaltwin.environment.model.TelemetryRecord;
import com.digitaltwin.environment.repository.StationRepository;
import com.digitaltwin.environment.repository.TelemetryRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StationService {

    private final StationRepository stationRepository;
    private final TelemetryRecordRepository telemetryRepository;

    public StationService(StationRepository stationRepository, TelemetryRecordRepository telemetryRepository) {
        this.stationRepository = stationRepository;
        this.telemetryRepository = telemetryRepository;
    }

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public List<Station> getStationsByState(String state) {
        if (state == null || state.isBlank() || "ALL".equalsIgnoreCase(state) || "All States".equalsIgnoreCase(state)) {
            return stationRepository.findAll();
        }
        return stationRepository.findByState(state);
    }

    public List<String> getDistinctStates() {
        return stationRepository.findDistinctStates();
    }

    public Optional<Station> getStationById(String id) {
        return stationRepository.findById(id);
    }

    public Station createStation(Station station) {
        if (station.getId() == null || station.getId().isBlank()) {
            station.setId("NODE-" + System.currentTimeMillis() % 100000);
        }
        if (station.getState() == null || station.getState().isBlank()) {
            station.setState("Delhi NCR");
        }
        return stationRepository.save(station);
    }

    public NearestStationResponse findNearestStation(Double userLat, Double userLng) {
        return findNearestStation(userLat, userLng, null);
    }

    public NearestStationResponse findNearestStation(Double userLat, Double userLng, String stateFilter) {
        List<Station> stations;
        if (stateFilter != null && !stateFilter.isBlank() && !"ALL".equalsIgnoreCase(stateFilter) && !"All States".equalsIgnoreCase(stateFilter)) {
            stations = stationRepository.findByState(stateFilter);
            if (stations.isEmpty()) {
                stations = stationRepository.findAll();
            }
        } else {
            stations = stationRepository.findAll();
        }
        if (stations.isEmpty()) {
            return null;
        }

        Station closestStation = null;
        double minDistance = Double.MAX_VALUE;

        for (Station s : stations) {
            double dist = haversineDistanceKm(userLat, userLng, s.getLatitude(), s.getLongitude());
            if (dist < minDistance) {
                minDistance = dist;
                closestStation = s;
            }
        }

        if (closestStation == null) {
            return null;
        }

        NearestStationResponse resp = new NearestStationResponse();
        resp.setUserLatitude(userLat);
        resp.setUserLongitude(userLng);
        resp.setDistanceKm(Math.round(minDistance * 100.0) / 100.0);

        if (minDistance < 1.0) {
            resp.setDistanceFormatted(Math.round(minDistance * 1000) + " meters");
        } else {
            resp.setDistanceFormatted(String.format("%.2f km", minDistance));
        }

        double bearing = calculateBearing(userLat, userLng, closestStation.getLatitude(), closestStation.getLongitude());
        resp.setBearingDegrees(Math.round(bearing * 10.0) / 10.0);
        resp.setCardinalDirection(getCardinalDirection(bearing));

        // Get latest telemetry for this station
        Optional<TelemetryRecord> latestOpt = telemetryRepository.findTopByStationIdOrderByRecordedAtDesc(closestStation.getId());
        if (latestOpt.isPresent()) {
            TelemetryRecord r = latestOpt.get();
            TelemetryDTO dto = mapToDto(closestStation, r);
            resp.setStationTelemetry(dto);

            // Microclimate assessment
            String aqiCat = TelemetryDTO.calculateAqiCategory(r.getAqi());
            String assessment = String.format("Paired with %s in %s zone (%s away, bearing %s). Ambient Air Quality is rated '%s' with AQI %d and temperature %.1f°C.",
                    closestStation.getName(), closestStation.getZoneType().replace("_", " "), resp.getDistanceFormatted(), resp.getCardinalDirection(), aqiCat, r.getAqi(), r.getTemperature());
            resp.setMicroclimateAssessment(assessment);
        }

        return resp;
    }

    private TelemetryDTO mapToDto(Station s, TelemetryRecord r) {
        TelemetryDTO dto = new TelemetryDTO();
        dto.setStationId(s.getId());
        dto.setStationName(s.getName());
        dto.setState(s.getState());
        dto.setZoneType(s.getZoneType());
        dto.setLatitude(s.getLatitude());
        dto.setLongitude(s.getLongitude());
        dto.setElevation(s.getElevation());
        dto.setStatus(s.getStatus());
        dto.setAqi(r.getAqi());
        dto.setPm25(r.getPm25());
        dto.setPm10(r.getPm10());
        dto.setTemperature(r.getTemperature());
        dto.setHumidity(r.getHumidity());
        dto.setCo2(r.getCo2());
        dto.setNoiseDb(r.getNoiseDb());
        dto.setUvIndex(r.getUvIndex());
        dto.setWindSpeed(r.getWindSpeed());
        dto.setWindDirection(r.getWindDirection());
        dto.setStatusSummary(r.getStatusSummary());
        dto.setRecordedAt(r.getRecordedAt());
        return dto;
    }

    // Great circle distance in kilometers
    private double haversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Bearing calculation from point 1 to point 2
    private double calculateBearing(double lat1, double lon1, double lat2, double lon2) {
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double deltaLambda = Math.toRadians(lon2 - lon1);
        double y = Math.sin(deltaLambda) * Math.cos(phi2);
        double x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
        double theta = Math.atan2(y, x);
        return (Math.toDegrees(theta) + 360) % 360;
    }

    private String getCardinalDirection(double degrees) {
        String[] directions = {"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"};
        int index = (int) Math.round(((degrees % 360) / 22.5)) % 16;
        return directions[index];
    }
}
