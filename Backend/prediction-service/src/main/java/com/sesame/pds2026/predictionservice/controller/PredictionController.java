package com.sesame.pds2026.predictionservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    @GetMapping("/bed-occupancy")
    public Map<String, Object> getBedOccupancyPrediction() {
        Map<String, Object> response = new HashMap<>();
        response.put("currentOccupancy", "75%");
        response.put("predictedOccupancyNextWeek", "85%");
        response.put("riskLevel", "HIGH");
        return response;
    }

    @GetMapping("/relapse-risk")
    public Map<String, Object> getRelapseRiskPrediction() {
        Map<String, Object> response = new HashMap<>();
        response.put("averageRisk", "15%");
        response.put("highRiskPatientsCount", 12);
        return response;
    }
}
