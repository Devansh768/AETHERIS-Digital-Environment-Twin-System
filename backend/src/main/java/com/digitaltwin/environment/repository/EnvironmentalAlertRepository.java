package com.digitaltwin.environment.repository;

import com.digitaltwin.environment.model.EnvironmentalAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnvironmentalAlertRepository extends JpaRepository<EnvironmentalAlert, Long> {
    List<EnvironmentalAlert> findByAcknowledgedFalseOrderByTriggeredAtDesc();
    List<EnvironmentalAlert> findTop15ByOrderByTriggeredAtDesc();
}
