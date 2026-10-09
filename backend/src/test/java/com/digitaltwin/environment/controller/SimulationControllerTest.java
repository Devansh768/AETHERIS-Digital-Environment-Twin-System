package com.digitaltwin.environment.controller;

import com.digitaltwin.environment.service.TelemetryService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class SimulationControllerTest {

    private final TelemetryService telemetryService = mock(TelemetryService.class);
    private LocalValidatorFactoryBean validator;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = standaloneSetup(new SimulationController(telemetryService))
                .setValidator(validator)
                .build();
    }

    @AfterEach
    void tearDown() {
        validator.close();
    }

    @Test
    void acceptsSupportedScenarioAndBoundaryValues() throws Exception {
        when(telemetryService.triggerSimulation(any())).thenReturn(Map.of("status", "ok"));

        mockMvc.perform(post("/api/simulation/trigger")
                        .contentType("application/json")
                        .content("""
                                {"stationId":"ALL","scenario":"storm_front","intensity":2.5,"durationMinutes":1}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));

        verify(telemetryService).triggerSimulation(any());
    }

    @Test
    void rejectsUnsupportedScenarioBeforeTriggeringSimulation() throws Exception {
        mockMvc.perform(post("/api/simulation/trigger")
                        .contentType("application/json")
                        .content("""
                                {"scenario":"VOLCANO","intensity":1.0,"durationMinutes":10}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.scenario").exists());

        verifyNoInteractions(telemetryService);
    }

    @Test
    void rejectsIntensityOutsideSupportedRange() throws Exception {
        mockMvc.perform(post("/api/simulation/trigger")
                        .contentType("application/json")
                        .content("""
                                {"scenario":"HEATWAVE","intensity":3.0,"durationMinutes":10}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.intensity").exists());

        verifyNoInteractions(telemetryService);
    }

    @Test
    void rejectsIntensityBelowSupportedRange() throws Exception {
        mockMvc.perform(post("/api/simulation/trigger")
                        .contentType("application/json")
                        .content("""
                                {"scenario":"HEATWAVE","intensity":0.49,"durationMinutes":10}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.intensity").exists());

        verifyNoInteractions(telemetryService);
    }

    @Test
    void rejectsNonPositiveDuration() throws Exception {
        mockMvc.perform(post("/api/simulation/trigger")
                        .contentType("application/json")
                        .content("""
                                {"scenario":"HEATWAVE","intensity":1.0,"durationMinutes":0}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.durationMinutes").exists());

        verifyNoInteractions(telemetryService);
    }

    @Test
    void rejectsMalformedStationId() throws Exception {
        mockMvc.perform(post("/api/simulation/trigger")
                        .contentType("application/json")
                        .content("""
                                {"stationId":"station/1","scenario":"HEATWAVE","intensity":1.0,"durationMinutes":10}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.stationId").exists());

        verifyNoInteractions(telemetryService);
    }
}
