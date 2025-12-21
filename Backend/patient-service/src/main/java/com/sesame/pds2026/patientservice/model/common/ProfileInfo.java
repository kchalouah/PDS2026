package com.sesame.pds2026.patientservice.model.common;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Embeddable
@Data
@Getter
@Setter
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

    // Explicit Getters and Setters
    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public Adresse getAdresse() { return adresse; }
    public void setAdresse(Adresse adresse) { this.adresse = adresse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getTelephoneSecondaire() { return telephoneSecondaire; }
    public void setTelephoneSecondaire(String telephoneSecondaire) { this.telephoneSecondaire = telephoneSecondaire; }
}
