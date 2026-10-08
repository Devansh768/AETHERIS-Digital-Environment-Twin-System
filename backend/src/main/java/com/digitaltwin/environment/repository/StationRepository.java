package com.digitaltwin.environment.repository;

import com.digitaltwin.environment.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, String> {
    List<Station> findByStatus(String status);
    List<Station> findByZoneType(String zoneType);
    List<Station> findByState(String state);

    @Query("SELECT DISTINCT s.state FROM Station s WHERE s.state IS NOT NULL ORDER BY s.state ASC")
    List<String> findDistinctStates();
}
