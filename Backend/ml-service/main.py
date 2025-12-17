from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.model import model_service

app = FastAPI(title="MedInsight ML Service", version="1.0.0")

class PredictionRequest(BaseModel):
    age: int
    distance: float
    lead_time: int
    previous_no_shows: int

class PredictionResponse(BaseModel):
    no_show_probability: float
    risk_level: str

@app.on_event("startup")
def startup_event():
    model_service.load_model()

@app.get("/")
def read_root():
    return {"status": "ML Service is running"}

@app.post("/predict/no-show", response_model=PredictionResponse)
def predict_no_show(request: PredictionRequest):
    try:
        prob = model_service.predict(
            request.age, 
            request.distance, 
            request.lead_time, 
            request.previous_no_shows
        )
        
        risk_level = "LOW"
        if prob > 0.7:
            risk_level = "HIGH"
        elif prob > 0.3:
            risk_level = "MEDIUM"
            
        return PredictionResponse(no_show_probability=prob, risk_level=risk_level)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
