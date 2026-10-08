package com.digitaltwin.environment.service;

import com.digitaltwin.environment.dto.SimulationRequest;
import com.digitaltwin.environment.dto.TelemetryDTO;
import com.digitaltwin.environment.model.EnvironmentalAlert;
import com.digitaltwin.environment.model.Station;
import com.digitaltwin.environment.model.TelemetryRecord;
import com.digitaltwin.environment.repository.EnvironmentalAlertRepository;
import com.digitaltwin.environment.repository.StationRepository;
import com.digitaltwin.environment.repository.TelemetryRecordRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class TelemetryService {

    private final StationRepository stationRepository;
    private final TelemetryRecordRepository telemetryRepository;
    private final EnvironmentalAlertRepository alertRepository;

    // Active simulation state
    private String activeScenario = "NORMAL";
    private double scenarioIntensity = 1.0;
    private LocalDateTime scenarioExpiresAt = LocalDateTime.now();

    public TelemetryService(
            StationRepository stationRepository,
            TelemetryRecordRepository telemetryRepository,
            EnvironmentalAlertRepository alertRepository) {
        this.stationRepository = stationRepository;
        this.telemetryRepository = telemetryRepository;
        this.alertRepository = alertRepository;
    }

    public List<TelemetryDTO> getLatestTelemetry() {
        List<Station> stations = stationRepository.findAll();
        List<TelemetryDTO> result = new ArrayList<>();

        for (Station s : stations) {
            Optional<TelemetryRecord> latestOpt = telemetryRepository.findTopByStationIdOrderByRecordedAtDesc(s.getId());
            if (latestOpt.isPresent()) {
                result.add(mapToDto(s, latestOpt.get()));
            }
        }
        return result;
    }

    public List<TelemetryRecord> getStationHistory(String stationId, int limit) {
        return telemetryRepository.findByStationIdOrderByRecordedAtDesc(stationId, PageRequest.of(0, Math.min(limit, 100)));
    }

    public Map<String, Object> triggerSimulation(SimulationRequest req) {
        this.activeScenario = (req.getScenario() != null) ? req.getScenario().toUpperCase() : "NORMAL";
        this.scenarioIntensity = (req.getIntensity() != null) ? req.getIntensity() : 1.0;
        int duration = (req.getDurationMinutes() != null) ? req.getDurationMinutes() : 15;
        this.scenarioExpiresAt = LocalDateTime.now().plusMinutes(duration);

        // Immediate step execution
        generateTelemetryTick(true, req.getStationId());

        Map<String, Object> resp = new HashMap<>();
        resp.put("scenario", this.activeScenario);
        resp.put("intensity", this.scenarioIntensity);
        resp.put("durationMinutes", duration);
        resp.put("status", "Simulation applied successfully to Digital Environment Twin nodes");
        return resp;
    }

    /**
     * Periodic background tick every 6 seconds to update twin metrics with realistic micro-variations.
     */
    @Scheduled(fixedRate = 6000)
    public void liveSimulationHeartbeat() {
        generateTelemetryTick(false, "ALL");
    }

    private void generateTelemetryTick(boolean forceEvent, String targetStationId) {
        List<Station> stations = stationRepository.findAll();
        boolean scenarioActive = LocalDateTime.now().isBefore(scenarioExpiresAt) && !"NORMAL".equalsIgnoreCase(activeScenario);

        for (Station s : stations) {
            if (!"ALL".equalsIgnoreCase(targetStationId) && targetStationId != null && !s.getId().equalsIgnoreCase(targetStationId)) {
                continue;
            }

            Optional<TelemetryRecord> prevOpt = telemetryRepository.findTopByStationIdOrderByRecordedAtDesc(s.getId());
            TelemetryRecord prev = prevOpt.orElse(null);

            // Baseline calculations based on zone
            double baseAqi = 75;
            double baseTemp = 27.0;
            double baseHum = 55.0;
            double baseCo2 = 450.0;
            double baseNoise = 50.0;

            if ("URBAN_CORE".equalsIgnoreCase(s.getZoneType())) {
                baseAqi = 140; baseTemp = 30.0; baseHum = 48.0; baseCo2 = 560.0; baseNoise = 68.0;
            } else if ("INDUSTRIAL_PARK".equalsIgnoreCase(s.getZoneType())) {
                baseAqi = 210; baseTemp = 32.5; baseHum = 42.0; baseCo2 = 720.0; baseNoise = 75.0;
            } else if ("FOREST_RESERVE".equalsIgnoreCase(s.getZoneType())) {
                baseAqi = 42; baseTemp = 24.0; baseHum = 70.0; baseCo2 = 390.0; baseNoise = 38.0;
            } else if ("COASTAL_BASIN".equalsIgnoreCase(s.getZoneType())) {
                baseAqi = 88; baseTemp = 26.5; baseHum = 74.0; baseCo2 = 420.0; baseNoise = 48.0;
            }

            // Apply active scenario effects
            double aqiMultiplier = 1.0;
            double tempOffset = 0.0;
            double humOffset = 0.0;
            double co2Multiplier = 1.0;

            if (scenarioActive) {
                switch (activeScenario) {
                    case "HEATWAVE":
                        tempOffset = 7.5 * scenarioIntensity;
                        humOffset = -15.0 * scenarioIntensity;
                        aqiMultiplier = 1.35 * scenarioIntensity;
                        break;
                    case "INDUSTRIAL_EMISSION":
                        if ("INDUSTRIAL_PARK".equalsIgnoreCase(s.getZoneType()) || "URBAN_CORE".equalsIgnoreCase(s.getZoneType())) {
                            aqiMultiplier = 1.8 * scenarioIntensity;
                            co2Multiplier = 1.6 * scenarioIntensity;
                        } else {
                            aqiMultiplier = 1.25 * scenarioIntensity;
                        }
                        break;
                    case "RAIN_CLEANSING":
                        humOffset = 22.0 * scenarioIntensity;
                        tempOffset = -4.5 * scenarioIntensity;
                        aqiMultiplier = 0.5 * (1.0 / scenarioIntensity);
                        co2Multiplier = 0.85;
                        break;
                    case "STORM_FRONT":
                        humOffset = 25.0 * scenarioIntensity;
                        tempOffset = -5.0 * scenarioIntensity;
                        baseNoise += 15.0 * scenarioIntensity;
                        break;
                }
            }

            // Random smooth walk around baseline
            double randomAqiDelta = ThreadLocalRandom.current().nextDouble(-3.0, 3.5);
            double randomTempDelta = ThreadLocalRandom.current().nextDouble(-0.3, 0.35);
            double randomHumDelta = ThreadLocalRandom.current().nextDouble(-0.8, 0.8);
            double randomCo2Delta = ThreadLocalRandom.current().nextDouble(-6.0, 7.0);

            double prevAqi = prev != null ? prev.getAqi() : baseAqi;
            double prevTemp = prev != null ? prev.getTemperature() : baseTemp;
            double prevHum = prev != null ? prev.getHumidity() : baseHum;
            double prevCo2 = prev != null ? prev.getCo2() : baseCo2;

            int newAqi = (int) Math.max(15, Math.min(500, Math.round((prevAqi * 0.85 + (baseAqi * aqiMultiplier) * 0.15) + randomAqiDelta)));
            double newTemp = Math.round(((prevTemp * 0.85 + (baseTemp + tempOffset) * 0.15) + randomTempDelta) * 10.0) / 10.0;
            double newHum = Math.round(Math.max(10, Math.min(99, (prevHum * 0.85 + (baseHum + humOffset) * 0.15) + randomHumDelta)) * 10.0) / 10.0;
            double newCo2 = Math.round(((prevCo2 * 0.85 + (baseCo2 * co2Multiplier) * 0.15) + randomCo2Delta) * 10.0) / 10.0;

            double newPm25 = Math.round((newAqi * 0.48 + ThreadLocalRandom.current().nextDouble(-1.5, 2.0)) * 10.0) / 10.0;
            double newPm10 = Math.round((newPm25 * 1.8 + ThreadLocalRandom.current().nextDouble(-3.0, 4.0)) * 10.0) / 10.0;
            double newNoise = Math.round((baseNoise + ThreadLocalRandom.current().nextDouble(-2.5, 3.0)) * 10.0) / 10.0;
            double newUv = Math.round((Math.max(1.0, 6.0 + ThreadLocalRandom.current().nextDouble(-1.0, 1.2))) * 10.0) / 10.0;
            double newWind = Math.round((Math.max(2.0, 7.0 + ThreadLocalRandom.current().nextDouble(-1.8, 2.5))) * 10.0) / 10.0;

            TelemetryRecord record = new TelemetryRecord();
            record.setStationId(s.getId());
            record.setAqi(newAqi);
            record.setPm25(newPm25);
            record.setPm10(newPm10);
            record.setTemperature(newTemp);
            record.setHumidity(newHum);
            record.setCo2(newCo2);
            record.setNoiseDb(newNoise);
            record.setUvIndex(newUv);
            record.setWindSpeed(newWind);
            record.setWindDirection(pickWindDirection());
            record.setStatusSummary(summarizeStatus(newAqi, newTemp));
            record.setRecordedAt(LocalDateTime.now());

            telemetryRepository.save(record);

            // Auto-check for severe thresholds to trigger environmental alert
            if (newAqi >= 250 && ThreadLocalRandom.current().nextInt(10) == 0) {
                alertRepository.save(new EnvironmentalAlert(
                        s.getId(),
                        "CRITICAL",
                        "AIR_QUALITY",
                        "Severe Air Quality Hazard: " + s.getName(),
                        "AQI spiked to " + newAqi + ". Atmospheric particulate concentration requires immediate warning."
                ));
            } else if (newTemp >= 38.0 && ThreadLocalRandom.current().nextInt(10) == 0) {
                alertRepository.save(new EnvironmentalAlert(
                        s.getId(),
                        "HAZARD",
                        "HEAT_STRESS",
                        "Extreme Thermal Heat Spike: " + s.getName(),
                        "Ambient temperature reached " + newTemp + "°C. Heat advisory triggered."
                ));
            }
        }
    }

    private String pickWindDirection() {
        String[] dirs = {"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"};
        return dirs[ThreadLocalRandom.current().nextInt(dirs.length)];
    }

    private String summarizeStatus(int aqi, double temp) {
        if (aqi > 250) return "Hazardous Air Quality";
        if (aqi > 180) return "Unhealthy Quality";
        if (temp > 35) return "Extreme Heat Alert";
        if (aqi <= 50) return "Pristine Atmospheric Condition";
        return "Optimal Operational Range";
    }

    private TelemetryDTO mapToDto(Station s, TelemetryRecord r) {
        TelemetryDTO dto = new TelemetryDTO();
        dto.setStationId(s.getId());
        dto.setStationName(s.getName());
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
}
