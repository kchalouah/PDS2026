package com.sesame.pds2026.patientservice.service;

import com.sesame.pds2026.patientservice.model.DossierMedical;
import com.sesame.pds2026.patientservice.model.Patient;
import com.sesame.pds2026.patientservice.Repository.PatientRepository;
import com.sesame.pds2026.patientservice.exception.NotFoundException;
import com.sesame.pds2026.patientservice.model.common.ProfileInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    @Transactional
    public Patient createPatient(Patient patient) {
        if (patient == null) throw new IllegalArgumentException("patient is required");
        log.debug("Creating patient: {} {}", patient.getNom(), patient.getPrenom());
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
        return patientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Patient not found: " + id));
    }

    public Patient getPatientByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient not found for user: " + userId));
    }

    public List<Patient> searchPatients(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return patientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(query, query);
    }

    @Transactional
    public Patient updatePatient(Long id, Patient details) {
        if (id == null) throw new IllegalArgumentException("id is required");
        if (details == null) throw new IllegalArgumentException("details are required");

        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Patient not found: " + id));

        // Update basic fields if provided
        Optional.ofNullable(details.getNom()).ifPresent(existing::setNom);
        Optional.ofNullable(details.getPrenom()).ifPresent(existing::setPrenom);
        Optional.ofNullable(details.getEmail()).ifPresent(existing::setEmail);
        Optional.ofNullable(details.getGender()).ifPresent(existing::setGender);
        Optional.ofNullable(details.getEmergencyContact()).ifPresent(existing::setEmergencyContact);

        // Update nested profile safely
        if (details.getProfile() != null) {
            if (existing.getProfile() == null) {
                existing.setProfile(new ProfileInfo());
            }
            Optional.ofNullable(details.getProfile().getDateNaissance())
                    .ifPresent(existing.getProfile()::setDateNaissance);
            Optional.ofNullable(details.getProfile().getTelephone())
                    .ifPresent(existing.getProfile()::setTelephone);
            Optional.ofNullable(details.getProfile().getTelephoneSecondaire())
                    .ifPresent(existing.getProfile()::setTelephoneSecondaire);
            Optional.ofNullable(details.getProfile().getAdresse())
                    .ifPresent(existing.getProfile()::setAdresse);
        }

        return patientRepository.save(existing);
    }
}
