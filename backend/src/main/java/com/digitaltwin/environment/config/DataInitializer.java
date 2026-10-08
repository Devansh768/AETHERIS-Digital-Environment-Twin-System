package com.digitaltwin.environment.config;

import com.digitaltwin.environment.model.EnvironmentalAlert;
import com.digitaltwin.environment.model.Station;
import com.digitaltwin.environment.model.TelemetryRecord;
import com.digitaltwin.environment.model.User;
import com.digitaltwin.environment.repository.EnvironmentalAlertRepository;
import com.digitaltwin.environment.repository.StationRepository;
import com.digitaltwin.environment.repository.TelemetryRecordRepository;
import com.digitaltwin.environment.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StationRepository stationRepository;
    private final TelemetryRecordRepository telemetryRepository;
    private final EnvironmentalAlertRepository alertRepository;
    private final SecurityHelper securityHelper;

    public DataInitializer(
            UserRepository userRepository,
            StationRepository stationRepository,
            TelemetryRecordRepository telemetryRepository,
            EnvironmentalAlertRepository alertRepository,
            SecurityHelper securityHelper) {
        this.userRepository = userRepository;
        this.stationRepository = stationRepository;
        this.telemetryRepository = telemetryRepository;
        this.alertRepository = alertRepository;
        this.securityHelper = securityHelper;
    }

    @Override
    public void run(String... args) {
        initUsers();
        initStations();
        initTelemetry();
        initAlerts();
    }

    private void initUsers() {
        if (userRepository.count() == 0) {
            User admin = new User(
                    "admin",
                    "admin@twin.env",
                    securityHelper.hashPassword("admin123"),
                    "System Administrator",
                    "ADMIN"
            );
            admin.setLastLatitude(28.6139);
            admin.setLastLongitude(77.2090);

            User operator = new User(
                    "operator",
                    "operator@twin.env",
                    securityHelper.hashPassword("operator123"),
                    "Lead Environmental Engineer",
                    "OPERATOR"
            );
            operator.setLastLatitude(28.5355);
            operator.setLastLongitude(77.3910);

            userRepository.saveAll(List.of(admin, operator));
            System.out.println(">>> Initialized default users: admin / admin123, operator / operator123");
        }
    }

    private void initStations() {
        if (stationRepository.count() == 0) {
            List<Station> stations = List.of(
                    // Delhi NCR
                    new Station(
                            "NODE-METRO-01", "Metro Central Hub Station", "Delhi NCR",
                            "URBAN_CORE", 28.6139, 77.2090, 216.0, "ACTIVE",
                            "High-density urban intersection with heavy vehicular traffic monitoring"
                    ),
                    new Station(
                            "NODE-FOREST-03", "North Ridge Botanical Bio-Reserve", "Delhi NCR",
                            "FOREST_RESERVE", 28.6850, 77.2150, 235.0, "ACTIVE",
                            "Biodiversity baseline and carbon absorption reference node"
                    ),
                    new Station(
                            "NODE-COAST-05", "Riverside Yamuna Wetland Station", "Delhi NCR",
                            "COASTAL_BASIN", 28.6400, 77.2600, 205.0, "ACTIVE",
                            "Riverine humidity, atmospheric dispersion, and cooling effect station"
                    ),

                    // Maharashtra
                    new Station(
                            "NODE-MUM-01", "Mumbai Harbour Coastal Marine Observatory", "Maharashtra",
                            "COASTAL_BASIN", 18.9220, 72.8347, 14.0, "ACTIVE",
                            "Maritime humidity, coastal wind current vectors, and salt-mist particulate sensing"
                    ),
                    new Station(
                            "NODE-PUN-02", "Pune Hinjewadi Tech Corridor", "Maharashtra",
                            "URBAN_CORE", 18.5913, 73.7389, 560.0, "ACTIVE",
                            "High-tech industrial IT park microclimate and heat island sensor grid"
                    ),
                    new Station(
                            "NODE-GHAT-03", "Western Ghats Ecological Canopy Reserve", "Maharashtra",
                            "FOREST_RESERVE", 18.7500, 73.4000, 780.0, "ACTIVE",
                            "Pristine rainforest baseline, oxygen generation, and high-altitude mist tracking"
                    ),

                    // Karnataka
                    new Station(
                            "NODE-BLR-01", "Bengaluru Silicon Smart Hub", "Karnataka",
                            "URBAN_CORE", 12.8399, 77.6770, 920.0, "ACTIVE",
                            "Electronic City microclimate node with acoustic noise and particulate telemetry"
                    ),
                    new Station(
                            "NODE-BLR-02", "Bannerghatta Forest Carbon Sink", "Karnataka",
                            "FOREST_RESERVE", 12.8009, 77.5777, 890.0, "ACTIVE",
                            "Ecological reserve tracking flora CO2 sequestration and humidity cycles"
                    ),

                    // Tamil Nadu
                    new Station(
                            "NODE-CHN-01", "Chennai Marina Coastal Atmospheric Lab", "Tamil Nadu",
                            "COASTAL_BASIN", 13.0475, 80.2824, 10.0, "ACTIVE",
                            "Bay of Bengal maritime boundary layer and oceanic aerosol monitoring"
                    ),
                    new Station(
                            "NODE-CHN-02", "Guindy Industrial Eco-Zone", "Tamil Nadu",
                            "INDUSTRIAL_PARK", 13.0067, 80.2025, 30.0, "ACTIVE",
                            "Manufacturing cluster with continuous PM2.5 and volatile compound sensing"
                    ),

                    // Uttar Pradesh
                    new Station(
                            "NODE-INDUS-02", "Noida Industrial Sector 62 Park", "Uttar Pradesh",
                            "INDUSTRIAL_PARK", 28.5355, 77.3910, 198.0, "ACTIVE",
                            "Heavy manufacturing and thermal exhaust dispersion sensor cluster"
                    ),
                    new Station(
                            "NODE-KNP-01", "Kanpur Ganga Basin Microclimate Node", "Uttar Pradesh",
                            "COASTAL_BASIN", 26.4499, 80.3319, 126.0, "ACTIVE",
                            "Riparian atmospheric corridor tracking seasonal fog and humidity index"
                    ),

                    // Gujarat
                    new Station(
                            "NODE-GUJ-01", "Ahmedabad Sabarmati Environmental Hub", "Gujarat",
                            "URBAN_CORE", 23.0300, 72.5800, 53.0, "ACTIVE",
                            "Riverfront urban thermal inversion and dust particulate dispersion array"
                    )
            );
            stationRepository.saveAll(stations);
            System.out.println(">>> Initialized " + stations.size() + " state-wise digital environment twin monitoring stations");
        }
    }

    private void initTelemetry() {
        if (telemetryRepository.count() == 0) {
            // Delhi NCR
            saveRecord("NODE-METRO-01", 142, 62.4, 118.0, 29.5, 48.0, 540.0, 68.5, 6.2, 7.5, "NW", "Moderate Air Quality");
            saveRecord("NODE-FOREST-03", 46, 12.3, 28.0, 24.2, 68.0, 395.0, 41.0, 4.5, 6.8, "NE", "Good (Pristine)");
            saveRecord("NODE-COAST-05", 92, 38.6, 71.0, 26.4, 72.0, 430.0, 49.0, 5.5, 11.4, "E", "Satisfactory");

            // Maharashtra
            saveRecord("NODE-MUM-01", 88, 32.5, 64.0, 31.2, 78.0, 440.0, 65.0, 7.1, 14.2, "SW", "Satisfactory (Maritime Breeze)");
            saveRecord("NODE-PUN-02", 76, 28.4, 52.0, 28.0, 55.0, 415.0, 58.2, 6.5, 9.8, "W", "Good Ambient Quality");
            saveRecord("NODE-GHAT-03", 32, 8.1, 18.5, 21.8, 85.0, 380.0, 36.0, 3.8, 5.4, "WNW", "Pristine Canopy Quality");

            // Karnataka
            saveRecord("NODE-BLR-01", 68, 24.0, 45.0, 25.5, 58.0, 420.0, 62.0, 5.9, 8.5, "SE", "Moderate Air Quality");
            saveRecord("NODE-BLR-02", 38, 9.5, 22.0, 23.0, 70.0, 388.0, 38.5, 4.2, 6.1, "S", "Pristine Forest Air");

            // Tamil Nadu
            saveRecord("NODE-CHN-01", 82, 30.1, 58.0, 32.0, 82.0, 435.0, 64.0, 8.2, 16.5, "ENE", "Satisfactory Coastal Air");
            saveRecord("NODE-CHN-02", 155, 68.0, 124.0, 33.5, 65.0, 580.0, 72.0, 7.5, 7.2, "E", "Unhealthy for Sensitive Groups");

            // Uttar Pradesh
            saveRecord("NODE-INDUS-02", 215, 110.8, 185.0, 32.8, 42.0, 720.0, 74.2, 5.8, 4.2, "N", "Unhealthy Air Quality");
            saveRecord("NODE-KNP-01", 168, 74.2, 135.0, 30.2, 60.0, 560.0, 66.5, 6.0, 6.8, "NW", "Unhealthy for Sensitive Groups");

            // Gujarat
            saveRecord("NODE-GUJ-01", 135, 58.6, 112.0, 34.2, 38.0, 510.0, 67.0, 8.5, 10.2, "W", "Moderate Air Quality");

            System.out.println(">>> Initialized multi-state environmental telemetry records");
        }
    }

    private void saveRecord(String stationId, int aqi, double pm25, double pm10, double temp, double hum, double co2, double noise, double uv, double wind, String dir, String summary) {
        TelemetryRecord rec = new TelemetryRecord();
        rec.setStationId(stationId);
        rec.setAqi(aqi);
        rec.setPm25(pm25);
        rec.setPm10(pm10);
        rec.setTemperature(temp);
        rec.setHumidity(hum);
        rec.setCo2(co2);
        rec.setNoiseDb(noise);
        rec.setUvIndex(uv);
        rec.setWindSpeed(wind);
        rec.setWindDirection(dir);
        rec.setStatusSummary(summary);
        rec.setRecordedAt(LocalDateTime.now().minusMinutes(5));
        telemetryRepository.save(rec);
    }

    private void initAlerts() {
        if (alertRepository.count() == 0) {
            EnvironmentalAlert a1 = new EnvironmentalAlert(
                    "NODE-INDUS-02",
                    "CRITICAL",
                    "AIR_QUALITY",
                    "Particulate AQI Spike Warning",
                    "PM2.5 exceeds permissible threshold (110.8 ug/m3). Industrial exhaust scrubbing recommended."
            );
            EnvironmentalAlert a2 = new EnvironmentalAlert(
                    "NODE-METRO-01",
                    "WARNING",
                    "NOISE",
                    "Acoustic Pollution Advisory",
                    "Traffic noise reached sustained peak of 68.5 dB during rush hours."
            );
            alertRepository.saveAll(List.of(a1, a2));
            System.out.println(">>> Initialized baseline environmental hazard alerts");
        }
    }
}
