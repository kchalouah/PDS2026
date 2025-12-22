package com.sesame.pds2026.securityservice.controller;

import com.sesame.pds2026.securityservice.model.SecurityOfficer;
import com.sesame.pds2026.securityservice.service.SecurityOfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-officers")
public class SecurityOfficerController {

    @Autowired
    private SecurityOfficerService securityOfficerService;

    @PostMapping
    public SecurityOfficer createSecurityOfficer(@RequestBody SecurityOfficer officer) {
        return securityOfficerService.createSecurityOfficer(officer);
    }

    @GetMapping
    public List<SecurityOfficer> getAllSecurityOfficers() {
        return securityOfficerService.getAllSecurityOfficers();
    }

    @GetMapping("/{id}")
    public SecurityOfficer getSecurityOfficerById(@PathVariable Long id) {
        return securityOfficerService.getSecurityOfficerById(id);
    }

    @GetMapping("/user/{userId}")
    public SecurityOfficer getSecurityOfficerByUserId(@PathVariable Long userId) {
        return securityOfficerService.getSecurityOfficerByUserId(userId);
    }

    @PutMapping("/{id}")
    public SecurityOfficer updateSecurityOfficer(@PathVariable Long id, @RequestBody SecurityOfficer officer) {
        return securityOfficerService.updateSecurityOfficer(id, officer);
    }
    @DeleteMapping("/{id}")
    public void deleteSecurityOfficer(@PathVariable Long id) {
        securityOfficerService.deleteSecurityOfficer(id);
    }
}
