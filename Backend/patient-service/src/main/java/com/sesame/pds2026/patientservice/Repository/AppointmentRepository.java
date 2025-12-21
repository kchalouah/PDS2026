package com.sesame.pds2026.patientservice.Repository;

import com.sesame.pds2026.patientservice.model.Appointment;
import com.sesame.pds2026.patientservice.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByMedecinId(Long medecinId);

    @Query("select a from Appointment a where a.medecinId = :medecinId and a.status in :active and (a.startAt < :endAt and a.endAt > :startAt)")
    List<Appointment> findOverlapsForMedecin(@Param("medecinId") Long medecinId,
                                             @Param("startAt") LocalDateTime startAt,
                                             @Param("endAt") LocalDateTime endAt,
                                             @Param("active") List<AppointmentStatus> activeStatuses);

    @Query("select a from Appointment a where a.patientId = :patientId and a.status in :active and (a.startAt < :endAt and a.endAt > :startAt)")
    List<Appointment> findOverlapsForPatient(@Param("patientId") Long patientId,
                                             @Param("startAt") LocalDateTime startAt,
                                             @Param("endAt") LocalDateTime endAt,
                                             @Param("active") List<AppointmentStatus> activeStatuses);
}
