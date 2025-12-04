package com.sesame.pds2026.securityservice.repository;

import com.sesame.pds2026.securityservice.model.SecurityOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecurityOfficerRepository extends JpaRepository<SecurityOfficer, Long> {
    Optional<SecurityOfficer> findByUserId(Long userId);
}
