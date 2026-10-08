package com.digitaltwin.environment.controller;

import com.digitaltwin.environment.dto.NearestStationResponse;
import com.digitaltwin.environment.model.Station;
import com.digitaltwin.environment.service.StationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "*")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping
    public ResponseEntity<List<Station>> getAllStations(@RequestParam(value = "state", required = false) String state) {
        if (state != null && !state.isBlank() && !"ALL".equalsIgnoreCase(state)) {
            return ResponseEntity.ok(stationService.getStationsByState(state));
        }
        return ResponseEntity.ok(stationService.getAllStations());
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getDistinctStates() {
        return ResponseEntity.ok(stationService.getDistinctStates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Station> getStationById(@PathVariable String id) {
        return stationService.getStationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Station> createStation(@RequestBody Station station) {
        Station created = stationService.createStation(station);
        return ResponseEntity.ok(created);
    }

    /**
     * Endpoint invoked when device/app location is detected or allowed via popup on screen.
     */
    @GetMapping("/nearest")
    public ResponseEntity<?> getNearestStation(
            @RequestParam("lat") Double lat,
            @RequestParam("lng") Double lng,
            @RequestParam(value = "state", required = false) String state) {
        if (lat == null || lng == null) {
            return ResponseEntity.badRequest().body("lat and lng parameters are required.");
        }
        NearestStationResponse resp = stationService.findNearestStation(lat, lng, state);
        if (resp != null) {
            return ResponseEntity.ok(resp);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
