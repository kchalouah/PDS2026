package com.sesame.pds2026.gestionservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/gestion")
public class GestionController {

    @GetMapping("/stats")
    public Map<String, Object> getStatistics() {
        // Mock statistics for now
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", 150);
        stats.put("totalDoctors", 20);
        stats.put("activeConsultations", 5);
        stats.put("occupancyRate", "75%");
        return stats;
    }
}
