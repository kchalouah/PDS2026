package com.sesame.pds2026.patientservice.service;

import com.sesame.pds2026.patientservice.model.DossierMedical;
import com.sesame.pds2026.patientservice.repository.DossierMedicalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DossierMedicalService {

    @Autowired
    private DossierMedicalRepository dossierMedicalRepository;

    public List<DossierMedical> getAllDossiers() {
        return dossierMedicalRepository.findAll();
    }

    public DossierMedical getDossierById(Long id) {
        return dossierMedicalRepository.findById(id).orElse(null);
    }

    public DossierMedical getDossierByPatientId(Long patientId) {
        return dossierMedicalRepository.findByPatientId(patientId).orElse(null);
    }

    public DossierMedical updateDossier(Long id, DossierMedical dossier) {
        DossierMedical existing = dossierMedicalRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setStatus(dossier.getStatus());
            existing.setAntecedents(dossier.getAntecedents());
            return dossierMedicalRepository.save(existing);
        }
        return null;
    }
}
