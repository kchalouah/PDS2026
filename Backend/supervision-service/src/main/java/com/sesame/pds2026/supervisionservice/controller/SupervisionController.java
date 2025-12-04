package com.sesame.pds2026.supervisionservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/supervision")
public class SupervisionController {

    @GetMapping("/health")
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("services", Map.of(
                "patient-service", "UP",
                "medecin-service", "UP",
                "security-service", "UP",
                "gestion-service", "UP",
                "prediction-service", "UP"
        ));
        return health;
    }

    @GetMapping("/metrics")
    public Map<String, Object> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRequests", 15420);
        metrics.put("averageResponseTime", "125ms");
        metrics.put("errorRate", "0.5%");
        metrics.put("uptime", "99.9%");
        metrics.put("activeConnections", 42);
        return metrics;
    }

    @GetMapping("/alerts")
    public Map<String, Object> getSystemAlerts() {
        Map<String, Object> alerts = new HashMap<>();
        alerts.put("critical", 0);
        alerts.put("warning", 2);
        alerts.put("info", 5);
        alerts.put("recentAlerts", java.util.List.of(
                Map.of("level", "WARNING", "message", "High memory usage on patient-service", "timestamp", LocalDateTime.now().minusHours(2)),
                Map.of("level", "INFO", "message", "Scheduled maintenance completed", "timestamp", LocalDateTime.now().minusHours(5))
        ));
        return alerts;
    }
}
