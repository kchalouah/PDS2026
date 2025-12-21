package com.sesame.pds2026.securityservice.model;

import com.sesame.pds2026.securityservice.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "security_officers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class SecurityOfficer extends BaseEntity {


    private Long userId; // Link to User in Security Service
    private String clearanceLevel; // e.g., L1, L2, L3
    private String responsibilities; // Specific security responsibilities

    public Long getId() {
        return id;
    }

}
