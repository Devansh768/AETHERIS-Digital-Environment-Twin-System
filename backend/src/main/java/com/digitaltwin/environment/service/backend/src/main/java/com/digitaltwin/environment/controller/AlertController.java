package com.digitaltwin.environment.controller;

import com.digitaltwin.environment.model.EnvironmentalAlert;
import com.digitaltwin.environment.repository.EnvironmentalAlertRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final EnvironmentalAlertRepository alertRepository;

    public AlertController(EnvironmentalAlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @GetMapping
    public ResponseEntity<List<EnvironmentalAlert>> getAlerts(
            @RequestParam(value = "unacknowledgedOnly", defaultValue = "false") boolean unackOnly) {
        if (unackOnly) {
            return ResponseEntity.ok(alertRepository.findByAcknowledgedFalseOrderByTriggeredAtDesc());
        }
        return ResponseEntity.ok(alertRepository.findTop15ByOrderByTriggeredAtDesc());
    }

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<?> acknowledgeAlert(@PathVariable Long id) {
        Optional<EnvironmentalAlert> alertOpt = alertRepository.findById(id);
        if (alertOpt.isPresent()) {
            EnvironmentalAlert a = alertOpt.get();
            a.setAcknowledged(true);
            alertRepository.save(a);
            return ResponseEntity.ok(Map.of("success", true, "id", id));
        }
        return ResponseEntity.notFound().build();
    }
}
