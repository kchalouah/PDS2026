package com.sesame.pds2026.medecinservice.model;

import com.sesame.pds2026.medecinservice.model.common.ProfileInfo;
import com.sesame.pds2026.medecinservice.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class Medecin extends BaseEntity {

    private Long userId; // Link to Keycloak user ID

    private String nom;
    private String prenom;
    private String email;
    
    @Embedded
    private ProfileInfo profile;
    
    private String role = "MEDECIN";

    // Medecin-specific fields
    private String specialite;
    private String hospitalName;
    private String department;
    private boolean isAvailable = true;

}
