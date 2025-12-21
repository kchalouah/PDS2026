package com.sesame.pds2026.medecinservice.model.common;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Adresse {
    private String rue;
    private String ville;
    private String codePostal;
    private String pays;
}
