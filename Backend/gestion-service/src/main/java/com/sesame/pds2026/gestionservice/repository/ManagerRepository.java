package com.sesame.pds2026.gestionservice.repository;

import com.sesame.pds2026.gestionservice.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long> {
    Optional<Manager> findByUserId(Long userId);
}
