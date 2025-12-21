package com.sesame.pds2026.patientservice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class BookAppointmentRequest {
    @NotNull
    private Long patientId;
    @NotNull
    private Long medecinId;
    @NotNull @Future
    private LocalDateTime startAt;
    @NotNull @Future
    private LocalDateTime endAt;
    private String reason;

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getMedecinId() { return medecinId; }
    public void setMedecinId(Long medecinId) { this.medecinId = medecinId; }
    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }
    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
