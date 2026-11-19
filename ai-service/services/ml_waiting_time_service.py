"""
Machine Learning Waiting-Time Prediction Model

Concept: Uses a Scikit-Learn RandomForestRegressor trained on synthetic hospital queue feature data
to predict OPD consultation waiting duration in minutes.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

MODEL_PATH = "models/waiting_time_model.joblib"

class MLWaitingTimePredictor:
    def __init__(self):
        self.model = None
        self._ensure_model_trained()

    def _ensure_model_trained(self):
        os.makedirs("models", exist_ok=True)
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            self._train_synthetic_model()

    def _train_synthetic_model(self):
        # Generate synthetic training dataset (1,000 operational records)
        np.random.seed(42)
        n_samples = 1000

        queue_length = np.random.randint(0, 20, n_samples)
        department_code = np.random.randint(0, 5, n_samples) # 0=Cardiology, 1=Neurology, 2=Ortho, 3=Peds, 4=GenMed
        hour_of_day = np.random.randint(8, 18, n_samples)
        doctor_exp = np.random.randint(2, 25, n_samples)

        # Target: Waiting time in minutes (formula + noise)
        base_time = queue_length * 14.0 + (18 - hour_of_day) * 0.8 - doctor_exp * 0.3
        wait_time = np.maximum(base_time + np.random.normal(0, 3, n_samples), 2.0)

        X = pd.DataFrame({
            'queue_length': queue_length,
            'department_code': department_code,
            'hour_of_day': hour_of_day,
            'doctor_exp': doctor_exp
        })
        y = wait_time

        # Fit RandomForestRegressor
        self.model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.model.fit(X, y)

        joblib.dump(self.model, MODEL_PATH)

    def predict(self, queue_length: int, department: str, hour_of_day: int = 10, doctor_exp: int = 10) -> float:
        dept_map = {
            'Cardiology': 0, 'Neurology': 1, 'Orthopedics': 2,
            'Pediatrics': 3, 'General Medicine': 4
        }
        dept_code = dept_map.get(department, 4)

        input_df = pd.DataFrame([{
            'queue_length': queue_length,
            'department_code': dept_code,
            'hour_of_day': hour_of_day,
            'doctor_exp': doctor_exp
        }])

        pred = self.model.predict(input_df)[0]
        return round(float(max(pred, 3.0)), 1)

predictor = MLWaitingTimePredictor()

def predict_waiting_time(queue_length: int, department: str, hour_of_day: int = 10, doctor_exp: int = 10):
    predicted_mins = predictor.predict(queue_length, department, hour_of_day, doctor_exp)
    return {
        "predictedWaitingMinutes": predicted_mins,
        "algorithm": "Scikit-Learn RandomForestRegressor ML Model",
        "featuresUsed": ["queue_length", "department_code", "hour_of_day", "doctor_experience"]
    }
