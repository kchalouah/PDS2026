package com.sesame.pds2026.patientservice.controller;

import com.sesame.pds2026.patientservice.model.Patient;
import com.sesame.pds2026.patientservice.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@lombok.RequiredArgsConstructor
@org.springframework.validation.annotation.Validated
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public Patient createPatient(@Valid @RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam String query) {
        return patientService.searchPatients(query);
    }

    @GetMapping("/user/{userId}")
    public Patient getPatientByUserId(@PathVariable Long userId) {
        return patientService.getPatientByUserId(userId);
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return patientService.updatePatient(id, patient);
    }
}
