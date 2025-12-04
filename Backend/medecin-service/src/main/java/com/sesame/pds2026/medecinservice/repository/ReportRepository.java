package com.sesame.pds2026.medecinservice.repository;

import com.sesame.pds2026.medecinservice.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByDossierId(Long dossierId);
}
