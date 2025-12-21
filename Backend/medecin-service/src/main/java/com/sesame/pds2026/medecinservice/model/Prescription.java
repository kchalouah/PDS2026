package com.sesame.pds2026.medecinservice.model;

import java.time.LocalDateTime;
import java.util.List;
import com.sesame.pds2026.medecinservice.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class Prescription extends BaseEntity {


    private Long dossierId;
    private Long medecinId;

    @ElementCollection
    private List<String> medications;

    private String instructions;
    private LocalDateTime date;




}
