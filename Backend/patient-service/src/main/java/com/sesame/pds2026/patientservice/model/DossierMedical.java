package com.sesame.pds2026.patientservice.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.ElementCollection;
import com.sesame.pds2026.patientservice.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List; // Added import

import java.time.LocalDateTime;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DossierMedical extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime creationDate;
    private String status; // CREATED, UPDATED, ARCHIVED

    @ElementCollection
    private List<String> antecedents;

    @OneToOne
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Patient patient;


}
