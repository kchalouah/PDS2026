package com.sesame.pds2026.patientservice.model;

import com.sesame.pds2026.patientservice.model.common.ProfileInfo;
import jakarta.persistence.*; 
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Link to Keycloak user

    private String nom;
    private String prenom;
    private String email;
    
    @Embedded
    private ProfileInfo profile;
    
    private String role = "PATIENT";

    // Patient-specific fields
    private String gender;
    private String emergencyContact;

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    private DossierMedical dossierMedical;
}
