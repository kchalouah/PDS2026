package com.sesame.pds2026.patientservice.service;

import com.sesame.pds2026.patientservice.entity.Patient;
import com.sesame.pds2026.patientservice.exception.NotFoundException;
import com.sesame.pds2026.patientservice.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
    private final PatientRepository repo;

    public PatientService(PatientRepository repo) { this.repo = repo; }

    public Patient create(Patient p) { return repo.save(p); }

    public Patient update(Long id, Patient p) {
        Patient existing = repo.findById(id).orElseThrow(() -> new NotFoundException("Patient non trouvé"));
        existing.setNom(p.getNom());
        existing.setPrenom(p.getPrenom());
        existing.setAdresse(p.getAdresse());
        existing.setDateNaissance(p.getDateNaissance());
        existing.setEmail(p.getEmail());
        return repo.save(existing);
    }

    public Patient getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Patient non trouvé"));
    }

    public List<Patient> getAll() { return repo.findAll(); }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Patient non trouvé");
        repo.deleteById(id);
    }
}
