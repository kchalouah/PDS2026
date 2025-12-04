package com.sesame.pds2026.medecinservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name = "prediction-service")
public interface PredictionClient {

    @GetMapping("/api/predictions/bed-occupancy")
    Map<String, Object> getBedOccupancyPrediction();

    @GetMapping("/api/predictions/relapse-risk")
    Map<String, Object> getRelapseRiskPrediction();
}
