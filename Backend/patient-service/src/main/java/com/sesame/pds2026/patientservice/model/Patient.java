package com.sesame.pds2026.patientservice.model;

import com.sesame.pds2026.patientservice.model.common.BaseEntity;
import com.sesame.pds2026.patientservice.model.common.ProfileInfo;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;


@Entity
@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Patient extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId; // Link to Keycloak user ID

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
