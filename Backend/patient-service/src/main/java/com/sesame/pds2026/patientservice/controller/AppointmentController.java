package com.sesame.pds2026.patientservice.controller;

import com.sesame.pds2026.patientservice.dto.BookAppointmentRequest;
import com.sesame.pds2026.patientservice.dto.RescheduleAppointmentRequest;
import com.sesame.pds2026.patientservice.model.Appointment;
import com.sesame.pds2026.patientservice.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@Validated
@lombok.RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT','ROLE_MEDECIN','ROLE_ADMIN')")
    public Appointment createAppointment(@Valid @RequestBody BookAppointmentRequest req) {
        Appointment a = new Appointment();
        a.setPatientId(req.getPatientId());
        a.setMedecinId(req.getMedecinId());
        a.setStartAt(req.getStartAt());
        a.setEndAt(req.getEndAt());
        a.setReason(req.getReason());
        return appointmentService.createAppointment(a);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_MEDECIN','ROLE_ADMIN')")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT','ROLE_MEDECIN','ROLE_ADMIN')")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT','ROLE_MEDECIN','ROLE_ADMIN')")
    public List<Appointment> getAppointmentsByPatient(@PathVariable Long patientId) {
        return appointmentService.getAppointmentsByPatient(patientId);
    }

    @GetMapping("/medecin/{medecinId}")
    @PreAuthorize("hasAnyAuthority('ROLE_MEDECIN','ROLE_ADMIN')")
    public List<Appointment> getAppointmentsByMedecin(@PathVariable Long medecinId) {
        return appointmentService.getAppointmentsByMedecin(medecinId);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_MEDECIN','ROLE_ADMIN')")
    public Appointment updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        return appointmentService.updateAppointmentStatus(id, status);
    }

    @PutMapping("/{id}/reschedule")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT','ROLE_MEDECIN','ROLE_ADMIN')")
    public Appointment reschedule(@PathVariable Long id, @Valid @RequestBody RescheduleAppointmentRequest req) {
        return appointmentService.reschedule(id, req.getStartAt(), req.getEndAt());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT','ROLE_MEDECIN','ROLE_ADMIN')")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
    }
}
