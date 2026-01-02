package com.sesame.pds2026.patientservice.Repository;

import com.sesame.pds2026.patientservice.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUserId(String userId);

    // Search by name (case insensitive usually requires IgnoreCase, but let's keep it simple first or use query annotation if needed, but standard JPA keywords keycloak is standard)
    // Actually, let's use ContainingIgnoreCase for better UX
    List<Patient> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
}
