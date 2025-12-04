package com.sesame.pds2026.medecinservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "planning")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Planning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long medecinId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isAvailable;
}
