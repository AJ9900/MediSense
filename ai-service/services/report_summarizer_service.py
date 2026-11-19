"""
AI Medical Report Summarizer Module

Concept: Extracts key clinical parameters from diagnostic report text and highlights abnormal ranges.
"""

def summarize_medical_report(report_text: str):
    text_lower = report_text.lower()
    abnormal_observations = []
    normal_observations = []

    if "hemoglobin" in text_lower or "hb" in text_lower:
        if "low" in text_lower or "9." in text_lower or "10." in text_lower:
            abnormal_observations.append("Hemoglobin level is below standard reference range (Possible Anemia).")
        else:
            normal_observations.append("Hemoglobin levels are within standard limits.")

    if "wbc" in text_lower or "leukocyte" in text_lower:
        if "high" in text_lower or "12,000" in text_lower or "elevated" in text_lower:
            abnormal_observations.append("Elevated WBC count detected (Possible active infection/inflammation).")
        else:
            normal_observations.append("White Blood Cell (WBC) count is normal.")

    if not abnormal_observations:
        summary_text = "All key diagnostic parameters appear within expected physiological ranges."
    else:
        summary_text = "Attention Required: " + " ".join(abnormal_observations)

    return {
        "summary": summary_text,
        "abnormalObservations": abnormal_observations,
        "normalObservations": normal_observations,
        "disclaimer": "AI-generated summary. Verify with the original laboratory report and consulting doctor."
    }
