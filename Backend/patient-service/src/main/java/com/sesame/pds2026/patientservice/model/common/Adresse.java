package com.sesame.pds2026.patientservice.model.common;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Adresse {
    private String rue;
    private String ville;
    private String codePostal;
    private String pays;
}
