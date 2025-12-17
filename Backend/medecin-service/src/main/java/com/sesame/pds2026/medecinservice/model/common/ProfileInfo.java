package com.sesame.pds2026.medecinservice.model.common;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileInfo {
    private LocalDate dateNaissance;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "rue", column = @Column(name = "adresse_rue")),
        @AttributeOverride(name = "ville", column = @Column(name = "adresse_ville")),
        @AttributeOverride(name = "codePostal", column = @Column(name = "adresse_code_postal")),
        @AttributeOverride(name = "pays", column = @Column(name = "adresse_pays"))
    })
    private Adresse adresse;
    
    private String telephone;
    private String telephoneSecondaire;
}
