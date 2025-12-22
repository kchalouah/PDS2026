# Prediction Service API Documentation

## Overview
Provide AI-powered predictions for hospital management and patient care.

## Features
- Bed Occupancy Prediction
- Relapse Risk Analysis
- No-Show Prediction (Gateway to ML Service)

## API Endpoints

### Predictions
- **GET** `/api/predictions/bed-occupancy` - Get current and predicted bed occupancy
- **GET** `/api/predictions/relapse-risk` - Get patient relapse risk analysis
- **POST** `/api/predictions/predict-no-show` - Predict appointment no-show probability
