package com.sesame.pds2026.patientservice.controller;

import com.sesame.pds2026.patientservice.entity.Patient;
import com.sesame.pds2026.patientservice.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    private final PatientService service;
    public PatientController(PatientService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<Patient> create(@RequestBody Patient patient) {
        Patient created = service.create(patient);
        return ResponseEntity.created(URI.create("/api/patients/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<Patient>> list() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient patient) {
        return ResponseEntity.ok(service.update(id, patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
