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
public class Report extends BaseEntity {

    private Long dossierId; // Link to DossierMedical in Patient Service
    private Long medecinId; // Link to Medecin

    @Column(columnDefinition = "TEXT")
    private String content;
    private LocalDateTime date;


}
