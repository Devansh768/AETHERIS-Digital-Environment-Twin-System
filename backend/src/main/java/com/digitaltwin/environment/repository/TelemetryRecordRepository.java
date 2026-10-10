package com.digitaltwin.environment.repository;

import com.digitaltwin.environment.model.TelemetryRecord;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TelemetryRecordRepository extends JpaRepository<TelemetryRecord, Long> {
    List<TelemetryRecord> findByStationIdOrderByRecordedAtDesc(String stationId, Pageable pageable);

    @Query("SELECT t FROM TelemetryRecord t WHERE t.id IN (SELECT MAX(t2.id) FROM TelemetryRecord t2 GROUP BY t2.stationId)")
    List<TelemetryRecord> findLatestTelemetryForAllStations();

    Optional<TelemetryRecord> findTopByStationIdOrderByRecordedAtDesc(String stationId);

    List<TelemetryRecord> findTop20ByOrderByRecordedAtDesc();
}
