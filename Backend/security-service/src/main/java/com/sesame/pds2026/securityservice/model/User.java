package com.sesame.pds2026.securityservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password; // Encrypted password (nullable for OAuth2 users)

    private String provider; // LOCAL, GOOGLE, GITHUB
    
    private String providerId; // OAuth2 provider's user ID

    @NotBlank(message = "Role is required")
    private String role; // PATIENT, MEDECIN, MANAGER, SECURITY_OFFICER

    private String status; // ACTIVE, INACTIVE, SUSPENDED
}
