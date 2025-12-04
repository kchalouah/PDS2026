package com.sesame.pds2026.securityservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "security_officers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecurityOfficer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Link to User in Security Service
    private String clearanceLevel; // e.g., L1, L2, L3
    private String responsibilities; // Specific security responsibilities
}
