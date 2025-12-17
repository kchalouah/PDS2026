package com.sesame.pds2026.predictionservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictionResponse {
    @JsonProperty("no_show_probability")
    private double noShowProbability;
    
    @JsonProperty("risk_level")
    private String riskLevel;

    public PredictionResponse() {}

    public double getNoShowProbability() { return noShowProbability; }
    public void setNoShowProbability(double noShowProbability) { this.noShowProbability = noShowProbability; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
}
