package com.sesame.pds2026.predictionservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final org.springframework.web.client.RestTemplate restTemplate;

    public PredictionController(org.springframework.web.client.RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

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

    @org.springframework.web.bind.annotation.PostMapping("/predict-no-show")
    public com.sesame.pds2026.predictionservice.dto.PredictionResponse predictNoShow(@org.springframework.web.bind.annotation.RequestBody com.sesame.pds2026.predictionservice.dto.PredictionRequest request) {
        // In a real scenario, we might fetch patient data here if only ID is provided
        // For now, we forward the request to the ML Service
        String mlServiceUrl = "http://ml-service:8000/predict/no-show";
        return restTemplate.postForObject(mlServiceUrl, request, com.sesame.pds2026.predictionservice.dto.PredictionResponse.class);
    }
}
