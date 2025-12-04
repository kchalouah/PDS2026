package com.sesame.pds2026.patientservice.controller;

import com.sesame.pds2026.patientservice.model.DossierMedical;
import com.sesame.pds2026.patientservice.service.DossierMedicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dossiers")
public class DossierMedicalController {

    @Autowired
    private DossierMedicalService dossierMedicalService;

    @GetMapping
    public List<DossierMedical> getAllDossiers() {
        return dossierMedicalService.getAllDossiers();
    }

    @GetMapping("/{id}")
    public DossierMedical getDossierById(@PathVariable Long id) {
        return dossierMedicalService.getDossierById(id);
    }

    @GetMapping("/patient/{patientId}")
    public DossierMedical getDossierByPatientId(@PathVariable Long patientId) {
        return dossierMedicalService.getDossierByPatientId(patientId);
    }

    @PutMapping("/{id}")
    public DossierMedical updateDossier(@PathVariable Long id, @RequestBody DossierMedical dossier) {
        return dossierMedicalService.updateDossier(id, dossier);
    }
}
