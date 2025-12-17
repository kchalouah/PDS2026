package com.sesame.pds2026.securityservice.model;

import com.sesame.pds2026.securityservice.model.common.ProfileInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "responsables_securite")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponsableSecurite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Link to Keycloak user

    private String nom;
    private String prenom;
    private String email;
    
    @Embedded
    private ProfileInfo profile;
    
    private String role = "RESPONSABLE_SECURITE";

    // Security-specific fields
    private String clearanceLevel; // e.g., L1, L2, L3
    private String responsibilities;
}
