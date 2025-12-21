package com.sesame.pds2026.patientservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @NotNull
    private Long patientId;
    @NotNull
    private Long medecinId;

    @NotNull
    @Future
    private LocalDateTime startAt;

    @NotNull
    @Future
    private LocalDateTime endAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private AppointmentStatus status = AppointmentStatus.REQUESTED;

    private String reason;
}
