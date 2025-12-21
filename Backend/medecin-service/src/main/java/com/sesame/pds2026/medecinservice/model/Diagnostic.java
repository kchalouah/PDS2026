package com.sesame.pds2026.medecinservice.model;

import com.sesame.pds2026.medecinservice.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class Diagnostic extends BaseEntity {

    private Long dossierId; // Link to DossierMedical in Patient Service
    private Long medecinId; // Link to Medecin

    private String description;
    private Boolean isAvailable;

    private LocalDateTime date;


}
