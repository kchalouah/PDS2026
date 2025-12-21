package com.sesame.pds2026.securityservice.model;

import java.time.LocalDateTime;

import com.sesame.pds2026.securityservice.model.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;


@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class AuditLog extends BaseEntity {


    private String action; // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, ACCESS
    private String entityType; // USER, PATIENT, DOSSIER, etc.
    private Long entityId;
    private Long userId; // Who performed the action
    private String username;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String details; // Additional context


}
