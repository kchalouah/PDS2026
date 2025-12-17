import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

class NoShowModel:
    def __init__(self):
        self.model = None
        self.le_gender = LabelEncoder()
        self.model_path = "model.joblib"
        
    def train_dummy_model(self):
        """Trains a simple model on dummy data for demonstration purposes."""
        # Dummy dataset
        # Features: Age, Distance (km), LeadTime (days), PreviousNoShows
        # Target: NoShow (0 = No, 1 = Yes)
        data = {
            'Age': [25, 30, 45, 60, 22, 35, 50, 65, 20, 40],
            'Distance': [5, 10, 2, 15, 20, 3, 8, 12, 1, 7],
            'LeadTime': [2, 15, 1, 30, 5, 3, 20, 25, 1, 10],
            'PreviousNoShows': [0, 1, 0, 2, 1, 0, 1, 0, 0, 0],
            'NoShow': [0, 1, 0, 1, 1, 0, 1, 0, 0, 0]
        }
        df = pd.DataFrame(data)
        
        X = df.drop('NoShow', axis=1)
        y = df['NoShow']
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        joblib.dump(self.model, self.model_path)
        print("Dummy model trained and saved.")

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            self.train_dummy_model()

    def predict(self, age, distance, lead_time, previous_no_shows):
        if not self.model:
            self.load_model()
            
        features = np.array([[age, distance, lead_time, previous_no_shows]])
        probability = self.model.predict_proba(features)[0][1] # Probability of class 1 (No-Show)
        return float(probability)

# Singleton instance
model_service = NoShowModel()
