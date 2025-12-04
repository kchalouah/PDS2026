package com.sesame.pds2026.medecinservice.repository;

import com.sesame.pds2026.medecinservice.model.Diagnostic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosticRepository extends JpaRepository<Diagnostic, Long> {
    List<Diagnostic> findByDossierId(Long dossierId);
}
