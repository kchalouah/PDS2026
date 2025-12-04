package com.sesame.pds2026.medecinservice.service;

import com.sesame.pds2026.medecinservice.model.Diagnostic;
import com.sesame.pds2026.medecinservice.model.Medecin;
import com.sesame.pds2026.medecinservice.model.Report;
import com.sesame.pds2026.medecinservice.repository.DiagnosticRepository;
import com.sesame.pds2026.medecinservice.repository.MedecinRepository;
import com.sesame.pds2026.medecinservice.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MedecinService {

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private DiagnosticRepository diagnosticRepository;

    @Autowired
    private ReportRepository reportRepository;

    public Medecin createMedecin(Medecin medecin) {
        return medecinRepository.save(medecin);
    }

    public Diagnostic addDiagnostic(Diagnostic diagnostic) {
        diagnostic.setDate(LocalDateTime.now());
        return diagnosticRepository.save(diagnostic);
    }

    public Report addReport(Report report) {
        report.setDate(LocalDateTime.now());
        return reportRepository.save(report);
    }

    @Autowired
    private com.sesame.pds2026.medecinservice.repository.PrescriptionRepository prescriptionRepository;

    public com.sesame.pds2026.medecinservice.model.Prescription createPrescription(com.sesame.pds2026.medecinservice.model.Prescription prescription) {
        prescription.setDate(LocalDateTime.now());
        return prescriptionRepository.save(prescription);
    }

    public List<com.sesame.pds2026.medecinservice.model.Prescription> getPrescriptionsByDossier(Long dossierId) {
        return prescriptionRepository.findByDossierId(dossierId);
    }

    @Autowired
    private com.sesame.pds2026.medecinservice.repository.PlanningRepository planningRepository;

    public com.sesame.pds2026.medecinservice.model.Planning addPlanning(com.sesame.pds2026.medecinservice.model.Planning planning) {
        planning.setIsAvailable(true);
        return planningRepository.save(planning);
    }

    public List<com.sesame.pds2026.medecinservice.model.Planning> getPlanningByMedecin(Long medecinId) {
        return planningRepository.findByMedecinId(medecinId);
    }

    public List<Diagnostic> getDiagnosticsByDossier(Long dossierId) {
        return diagnosticRepository.findByDossierId(dossierId);
    }

    public List<Report> getReportsByDossier(Long dossierId) {
        return reportRepository.findByDossierId(dossierId);
    }
}
