package com.digitaltwin.environment.controller;

import com.digitaltwin.environment.dto.SimulationRequest;
import com.digitaltwin.environment.service.TelemetryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
@CrossOrigin(origins = "*")
public class SimulationController {

    private final TelemetryService telemetryService;

    public SimulationController(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    @PostMapping("/trigger")
    public ResponseEntity<Map<String, Object>> triggerSimulation(@RequestBody SimulationRequest request) {
        Map<String, Object> result = telemetryService.triggerSimulation(request);
        return ResponseEntity.ok(result);
    }
}
