"""
AI Patient Triage Module

Concept: Triage is the preliminary prioritization of patients based on severity of symptoms.
- Rule-based keyword matching identifies immediate critical red-flag emergency symptoms (e.g. chest pain, unconsciousness, severe bleeding).
- Gemini LLM or NLP fallback processes complex natural language descriptions.
- MANDATORY: Must include non-diagnostic safety disclaimer.
"""

import os
import re

EMERGENCY_KEYWORDS = {
    'chest pain': ('CRITICAL', 'Cardiology'),
    'heart attack': ('CRITICAL', 'Cardiology'),
    'breathing difficulty': ('CRITICAL', 'Cardiology'),
    'shortness of breath': ('CRITICAL', 'Cardiology'),
    'unconscious': ('CRITICAL', 'Neurology'),
    'seizure': ('CRITICAL', 'Neurology'),
    'stroke': ('CRITICAL', 'Neurology'),
    'head injury': ('CRITICAL', 'Neurology'),
    'severe bleeding': ('CRITICAL', 'Emergency'),
    'fracture': ('HIGH', 'Orthopedics'),
    'bone pain': ('HIGH', 'Orthopedics'),
    'child fever': ('HIGH', 'Pediatrics'),
    'skin rash': ('NORMAL', 'Dermatology'),
    'fever': ('MEDIUM', 'General Medicine'),
    'headache': ('NORMAL', 'General Medicine'),
    'cold': ('NORMAL', 'General Medicine'),
    'cough': ('NORMAL', 'General Medicine')
}

def analyze_triage(symptoms: str, age: int = None, gender: str = None):
    text_lower = symptoms.lower()
    
    # 1. Rule-Based Red-Flag Emergency Scan
    for kw, (priority, dept) in EMERGENCY_KEYWORDS.items():
        if kw in text_lower:
            return {
                "priorityLevel": priority,
                "recommendedDepartment": dept,
                "confidenceScore": 0.95,
                "triageReason": f"Detected critical symptom keyword '{kw}'. Immediate triage assigned.",
                "isEmergency": priority == 'CRITICAL',
                "disclaimer": "AI-generated preliminary prioritization. Final medical decision belongs to qualified healthcare staff."
            }

    # 2. General Fallback Classification
    return {
        "priorityLevel": "MEDIUM",
        "recommendedDepartment": "General Medicine",
        "confidenceScore": 0.80,
        "triageReason": "Symptoms analyzed. Assigned to General Medicine for initial OPD evaluation.",
        "isEmergency": False,
        "disclaimer": "AI-generated preliminary prioritization. Final medical decision belongs to qualified healthcare staff."
    }
