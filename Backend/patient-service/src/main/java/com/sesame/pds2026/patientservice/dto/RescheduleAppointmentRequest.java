package com.sesame.pds2026.patientservice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class RescheduleAppointmentRequest {
    @NotNull @Future
    private LocalDateTime startAt;
    @NotNull @Future
    private LocalDateTime endAt;

    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }
    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }
}
