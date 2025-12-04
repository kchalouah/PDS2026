package com.sesame.pds2026.medecinservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long dossierId; // Link to DossierMedical in Patient Service
    private Long medecinId; // Link to Medecin

    @Column(columnDefinition = "TEXT")
    private String content;
    private LocalDateTime date;
}
