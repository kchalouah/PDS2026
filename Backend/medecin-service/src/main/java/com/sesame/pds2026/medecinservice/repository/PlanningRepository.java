package com.sesame.pds2026.medecinservice.repository;

import com.sesame.pds2026.medecinservice.model.Planning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {
    List<Planning> findByMedecinId(Long medecinId);
}
