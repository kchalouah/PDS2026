package com.sesame.pds2026.securityservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action; // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, ACCESS
    private String entityType; // USER, PATIENT, DOSSIER, etc.
    private Long entityId;
    private Long userId; // Who performed the action
    private String username;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String details; // Additional context
}
