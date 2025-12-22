package com.sesame.pds2026.medecinservice.controller;

import com.sesame.pds2026.medecinservice.model.Diagnostic;
import com.sesame.pds2026.medecinservice.model.Medecin;
import com.sesame.pds2026.medecinservice.model.Report;
import com.sesame.pds2026.medecinservice.service.MedecinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medecins")
public class MedecinController {

    @Autowired
    private MedecinService medecinService;

    @Autowired
    private com.sesame.pds2026.medecinservice.client.PredictionClient predictionClient;

    @PostMapping
    public Medecin createMedecin(@RequestBody Medecin medecin) {
        return medecinService.createMedecin(medecin);
    }

    @GetMapping
    public List<Medecin> getAllMedecins() {
        return medecinService.getAllMedecins();
    }

    @GetMapping("/{id}")
    public Medecin getMedecinById(@PathVariable Long id) {
        return medecinService.getMedecinById(id);
    }

    @GetMapping("/user/{userId}")
    public Medecin getMedecinByUserId(@PathVariable Long userId) {
        return medecinService.getMedecinByUserId(userId);
    }

    @PutMapping("/{id}")
    public Medecin updateMedecin(@PathVariable Long id, @RequestBody Medecin medecin) {
        return medecinService.updateMedecin(id, medecin);
    }

    @DeleteMapping("/{id}")
    public void deleteMedecin(@PathVariable Long id) {
        medecinService.deleteMedecin(id);
    }

    @PostMapping("/diagnostics")
    public Diagnostic addDiagnostic(@RequestBody Diagnostic diagnostic) {
        return medecinService.addDiagnostic(diagnostic);
    }

    @PostMapping("/reports")
    public Report addReport(@RequestBody Report report) {
        return medecinService.addReport(report);
    }

    @PostMapping("/prescriptions")
    public com.sesame.pds2026.medecinservice.model.Prescription createPrescription(@RequestBody com.sesame.pds2026.medecinservice.model.Prescription prescription) {
        return medecinService.createPrescription(prescription);
    }

    @GetMapping("/prescriptions/dossier/{dossierId}")
    public List<com.sesame.pds2026.medecinservice.model.Prescription> getPrescriptionsByDossier(@PathVariable Long dossierId) {
        return medecinService.getPrescriptionsByDossier(dossierId);
    }

    @GetMapping("/diagnostics/dossier/{dossierId}")
    public List<Diagnostic> getDiagnosticsByDossier(@PathVariable Long dossierId) {
        return medecinService.getDiagnosticsByDossier(dossierId);
    }

    @PostMapping("/planning")
    public com.sesame.pds2026.medecinservice.model.Planning addPlanning(@RequestBody com.sesame.pds2026.medecinservice.model.Planning planning) {
        return medecinService.addPlanning(planning);
    }

    @GetMapping("/planning/medecin/{medecinId}")
    public List<com.sesame.pds2026.medecinservice.model.Planning> getPlanningByMedecin(@PathVariable Long medecinId) {
        return medecinService.getPlanningByMedecin(medecinId);
    }

    @GetMapping("/predict/bed-occupancy")
    public java.util.Map<String, Object> predictBedOccupancy() {
        return predictionClient.getBedOccupancyPrediction();
    }

    @GetMapping("/reports/dossier/{dossierId}")
    public List<Report> getReportsByDossier(@PathVariable Long dossierId) {
        return medecinService.getReportsByDossier(dossierId);
    }

    @DeleteMapping("/diagnostics/{id}")
    public void deleteDiagnostic(@PathVariable Long id) {
        medecinService.deleteDiagnostic(id);
    }

    @DeleteMapping("/reports/{id}")
    public void deleteReport(@PathVariable Long id) {
        medecinService.deleteReport(id);
    }

    @DeleteMapping("/prescriptions/{id}")
    public void deletePrescription(@PathVariable Long id) {
        medecinService.deletePrescription(id);
    }
}
