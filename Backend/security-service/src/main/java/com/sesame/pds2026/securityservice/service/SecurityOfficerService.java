package com.sesame.pds2026.securityservice.service;

import com.sesame.pds2026.securityservice.model.SecurityOfficer;
import com.sesame.pds2026.securityservice.repository.SecurityOfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityOfficerService {

    @Autowired
    private SecurityOfficerRepository securityOfficerRepository;

    public SecurityOfficer createSecurityOfficer(SecurityOfficer officer) {
        return securityOfficerRepository.save(officer);
    }

    public List<SecurityOfficer> getAllSecurityOfficers() {
        return securityOfficerRepository.findAll();
    }

    public SecurityOfficer getSecurityOfficerById(Long id) {
        return securityOfficerRepository.findById(id).orElse(null);
    }

    public SecurityOfficer getSecurityOfficerByUserId(Long userId) {
        return securityOfficerRepository.findByUserId(userId).orElse(null);
    }

    public SecurityOfficer updateSecurityOfficer(Long id, SecurityOfficer officer) {
        SecurityOfficer existing = securityOfficerRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setClearanceLevel(officer.getClearanceLevel());
            existing.setResponsibilities(officer.getResponsibilities());
            return securityOfficerRepository.save(existing);
        }
        return null;
    }
    public void deleteSecurityOfficer(Long id) {
        securityOfficerRepository.deleteById(id);
    }
}
