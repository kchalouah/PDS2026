package com.sesame.pds2026.gestionservice.model;

import com.sesame.pds2026.gestionservice.model.common.ProfileInfo;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gestionnaires")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GestionnaireService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Link to Keycloak user

    private String nom;
    private String prenom;
    private String email;
    
    @Embedded
    private ProfileInfo profile;
    
    private String role = "GESTIONNAIRE";

    // Management-specific fields
    private String departement;
    private String serviceArea;


}
