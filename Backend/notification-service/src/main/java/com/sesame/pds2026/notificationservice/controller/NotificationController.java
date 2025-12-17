package com.sesame.pds2026.notificationservice.controller;

import com.sesame.pds2026.notificationservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/email")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MEDECIN', 'ROLE_GESTIONNAIRE')")
    public ResponseEntity<String> sendEmail(@RequestParam String to, @RequestParam String subject, @RequestBody String text) {
        try {
            emailService.sendSimpleMessage(to, subject, text);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending email: " + e.getMessage());
        }
    }
}
