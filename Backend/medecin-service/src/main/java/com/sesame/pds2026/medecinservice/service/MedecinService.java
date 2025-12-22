package com.sesame.pds2026.medecinservice.service;

import com.sesame.pds2026.medecinservice.model.Diagnostic;
import com.sesame.pds2026.medecinservice.model.Medecin;
import com.sesame.pds2026.medecinservice.model.Report;
import com.sesame.pds2026.medecinservice.model.common.ProfileInfo;
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

    public List<Medecin> getAllMedecins() {
        return medecinRepository.findAll();
    }

    public Medecin getMedecinById(Long id) {
        return medecinRepository.findById(id).orElse(null);
    }

    public Medecin createMedecin(Medecin medecin) {
        return medecinRepository.save(medecin);
    }

    public Medecin getMedecinByUserId(Long userId) {
        return medecinRepository.findByUserId(userId).orElse(null);
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
    public Medecin updateMedecin(Long id, Medecin medecinDetails) {
        Medecin medecin = medecinRepository.findById(id).orElseThrow(() -> new RuntimeException("Medecin not found"));
        medecin.setNom(medecinDetails.getNom());
        medecin.setPrenom(medecinDetails.getPrenom());
        medecin.setSpecialite(medecinDetails.getSpecialite());
        // Telephone is part of embedded ProfileInfo — copy it safely if provided
        ProfileInfo newProfile = medecinDetails.getProfile();
        if (newProfile != null) {
            if (medecin.getProfile() == null) {
                medecin.setProfile(new ProfileInfo());
            }
            // copy fields that might be updated
            medecin.getProfile().setTelephone(newProfile.getTelephone());
            medecin.getProfile().setTelephoneSecondaire(newProfile.getTelephoneSecondaire());
            medecin.getProfile().setDateNaissance(newProfile.getDateNaissance());
            medecin.getProfile().setAdresse(newProfile.getAdresse());
        }
        // Update other simple fields
        medecin.setEmail(medecinDetails.getEmail());
        medecin.setHospitalName(medecinDetails.getHospitalName());
        medecin.setDepartment(medecinDetails.getDepartment());
         // `Medecin` boolean field is named `isAvailable` so Lombok generates
        // `isAvailable()` and `setAvailable(boolean)` methods.
        medecin.setAvailable(medecinDetails.isAvailable());
        // Update other fields as necessary
        return medecinRepository.save(medecin);
    }

    public void deleteMedecin(Long id) {
        medecinRepository.deleteById(id);
    }

    // Sub-entity deletions
    public void deleteDiagnostic(Long id) {
        diagnosticRepository.deleteById(id);
    }
    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}
