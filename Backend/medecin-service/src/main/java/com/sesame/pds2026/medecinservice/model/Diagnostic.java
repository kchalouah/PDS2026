package com.sesame.pds2026.medecinservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "diagnostics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diagnostic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long dossierId; // Link to DossierMedical in Patient Service
    private Long medecinId; // Link to Medecin

    private String description;
    private LocalDateTime date;
}
