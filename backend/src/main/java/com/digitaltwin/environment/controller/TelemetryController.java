package com.digitaltwin.environment.controller;

import com.digitaltwin.environment.dto.TelemetryDTO;
import com.digitaltwin.environment.model.TelemetryRecord;
import com.digitaltwin.environment.service.TelemetryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "*")
public class TelemetryController {

    private final TelemetryService telemetryService;

    public TelemetryController(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    @GetMapping("/live")
    public ResponseEntity<List<TelemetryDTO>> getLiveTelemetry() {
        return ResponseEntity.ok(telemetryService.getLatestTelemetry());
    }

    @GetMapping("/history/{stationId}")
    public ResponseEntity<List<TelemetryRecord>> getStationHistory(
            @PathVariable String stationId,
            @RequestParam(value = "limit", defaultValue = "25") int limit) {
        return ResponseEntity.ok(telemetryService.getStationHistory(stationId, limit));
    }
}
