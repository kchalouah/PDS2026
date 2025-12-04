package com.sesame.pds2026.medecinservice.repository;

import com.sesame.pds2026.medecinservice.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByDossierId(Long dossierId);
}
