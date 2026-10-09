package com.digitaltwin.environment.service;

import com.digitaltwin.environment.dto.SimulationRequest;
import com.digitaltwin.environment.repository.EnvironmentalAlertRepository;
import com.digitaltwin.environment.repository.StationRepository;
import com.digitaltwin.environment.repository.TelemetryRecordRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class TelemetryServiceTest {

    @Test
    void rejectsUnknownStationWithoutGeneratingTelemetry() {
        StationRepository stationRepository = mock(StationRepository.class);
        TelemetryRecordRepository telemetryRepository = mock(TelemetryRecordRepository.class);
        EnvironmentalAlertRepository alertRepository = mock(EnvironmentalAlertRepository.class);
        when(stationRepository.findAll()).thenReturn(List.of());

        TelemetryService service = new TelemetryService(stationRepository, telemetryRepository, alertRepository);
        SimulationRequest request = new SimulationRequest();
        request.setStationId("NODE-MISSING");
        request.setScenario("HEATWAVE");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.triggerSimulation(request));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(stationRepository).findAll();
        verifyNoInteractions(telemetryRepository, alertRepository);
    }
}
