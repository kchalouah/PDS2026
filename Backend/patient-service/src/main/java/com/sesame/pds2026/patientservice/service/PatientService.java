package com.sesame.pds2026.patientservice.service;

import com.sesame.pds2026.patientservice.model.DossierMedical;
import com.sesame.pds2026.patientservice.model.Patient;
import com.sesame.pds2026.patientservice.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient createPatient(Patient patient) {
        // Create a default DossierMedical
        DossierMedical dossier = new DossierMedical();
        dossier.setCreationDate(LocalDateTime.now());
        dossier.setStatus("CREATED");
        dossier.setPatient(patient);
        patient.setDossierMedical(dossier);
        
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElse(null);
    }

    public Patient getPatientByUserId(Long userId) {
        return patientRepository.findByUserId(userId).orElse(null);
    }
}
