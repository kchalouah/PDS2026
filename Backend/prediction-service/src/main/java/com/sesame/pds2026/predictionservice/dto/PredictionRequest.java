package com.sesame.pds2026.predictionservice.dto;

public class PredictionRequest {
    private int age;
    private double distance;
    private int lead_time;
    private int previous_no_shows;

    public PredictionRequest() {}

    public PredictionRequest(int age, double distance, int lead_time, int previous_no_shows) {
        this.age = age;
        this.distance = distance;
        this.lead_time = lead_time;
        this.previous_no_shows = previous_no_shows;
    }

    // Getters and Setters
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public double getDistance() { return distance; }
    public void setDistance(double distance) { this.distance = distance; }
    public int getLead_time() { return lead_time; }
    public void setLead_time(int lead_time) { this.lead_time = lead_time; }
    public int getPrevious_no_shows() { return previous_no_shows; }
    public void setPrevious_no_shows(int previous_no_shows) { this.previous_no_shows = previous_no_shows; }
}
