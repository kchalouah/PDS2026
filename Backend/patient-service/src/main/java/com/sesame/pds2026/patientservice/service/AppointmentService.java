package com.sesame.pds2026.patientservice.service;

import com.sesame.pds2026.patientservice.Repository.AppointmentRepository;
import com.sesame.pds2026.patientservice.exception.NotFoundException;
import com.sesame.pds2026.patientservice.model.Appointment;
import com.sesame.pds2026.patientservice.model.AppointmentStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@lombok.RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private static final List<AppointmentStatus> ACTIVE_STATUSES = List.of(AppointmentStatus.REQUESTED, AppointmentStatus.CONFIRMED);

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        validateTimeRange(appointment.getStartAt(), appointment.getEndAt());
        checkNoOverlap(appointment.getMedecinId(), appointment.getPatientId(), appointment.getStartAt(), appointment.getEndAt(), null);
        appointment.setStatus(AppointmentStatus.REQUESTED);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new NotFoundException("Appointment not found: " + id));
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByMedecin(Long medecinId) {
        return appointmentRepository.findByMedecinId(medecinId);
    }

    @Transactional
    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = getAppointmentById(id);
        AppointmentStatus newStatus = parseStatus(status);
        validateTransition(appointment.getStatus(), newStatus);
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment reschedule(Long id, LocalDateTime newStart, LocalDateTime newEnd) {
        validateTimeRange(newStart, newEnd);
        Appointment appointment = getAppointmentById(id);
        if (appointment.getStatus() == AppointmentStatus.CANCELLED || appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot reschedule a completed or cancelled appointment");
        }
        checkNoOverlap(appointment.getMedecinId(), appointment.getPatientId(), newStart, newEnd, id);
        appointment.setStartAt(newStart);
        appointment.setEndAt(newEnd);
        // keep status as REQUESTED if previously REQUESTED, else set back to REQUESTED awaiting confirmation
        appointment.setStatus(AppointmentStatus.REQUESTED);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    private void validateTimeRange(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) throw new IllegalArgumentException("Start and end must be provided");
        if (!end.isAfter(start)) throw new IllegalArgumentException("End time must be after start time");
        if (start.isBefore(LocalDateTime.now())) throw new IllegalArgumentException("Start time must be in the future");
    }

    private void checkNoOverlap(Long medecinId, Long patientId, LocalDateTime start, LocalDateTime end, Long excludeId) {
        var medOverlaps = appointmentRepository.findOverlapsForMedecin(medecinId, start, end, ACTIVE_STATUSES);
        var patOverlaps = appointmentRepository.findOverlapsForPatient(patientId, start, end, ACTIVE_STATUSES);
        boolean conflict = medOverlaps.stream().anyMatch(a -> !a.getId().equals(excludeId)) || patOverlaps.stream().anyMatch(a -> !a.getId().equals(excludeId));
        if (conflict) {
            throw new IllegalArgumentException("Time slot overlaps an existing appointment");
        }
    }

    private AppointmentStatus parseStatus(String status) {
        try {
            return AppointmentStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }

    private void validateTransition(AppointmentStatus current, AppointmentStatus next) {
        switch (current) {
            case REQUESTED -> {
                if (next != AppointmentStatus.CONFIRMED && next != AppointmentStatus.CANCELLED) {
                    throw new IllegalArgumentException("Invalid transition from REQUESTED to " + next);
                }
            }
            case CONFIRMED -> {
                if (next != AppointmentStatus.COMPLETED && next != AppointmentStatus.CANCELLED) {
                    throw new IllegalArgumentException("Invalid transition from CONFIRMED to " + next);
                }
            }
            case COMPLETED, CANCELLED -> throw new IllegalArgumentException("No transitions allowed from " + current);
        }
    }
}
