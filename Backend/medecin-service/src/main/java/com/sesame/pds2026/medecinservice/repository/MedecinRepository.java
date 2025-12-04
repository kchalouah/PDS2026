package com.sesame.pds2026.medecinservice.repository;

import com.sesame.pds2026.medecinservice.model.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    Optional<Medecin> findByUserId(Long userId);
}
