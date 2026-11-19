"""
Multilingual AI Health Assistant Chatbot

Concept: Handles conversational patient queries in English and Hindi.
Guideline: Must NOT diagnose diseases. Answers operational, triage, and department guidance questions.
"""

def generate_chatbot_response(query: str, language: str = "en"):
    q = query.lower()

    if language == "hi" or "नमस्ते" in q or "कैसे" in q or "डॉक्टर" in q:
        # Hindi Response Engine
        if "अपॉइंटमेंट" in q or "token" in q or "टोकन" in q:
            reply = "MediSense में आपका स्वागत है। आप 'Find Doctors' टैब से आसानी से अपॉइंटमेंट बुक कर सकते हैं और अपना डिजिटल टोकन (जैसे A-101) प्राप्त कर सकते हैं।"
        elif "दर्द" in q or "सीने" in q:
            reply = "यदि आपको सीने में दर्द या सांस लेने में तकलीफ है, तो कृपया तुरंत कार्डियोलॉजी (Cardiology) या इमरजेंसी विभाग से संपर्क करें।"
        else:
            reply = "नमस्ते! मैं मेडीसेंस एआई स्वास्थ्य सहायक हूँ। मैं आपको अस्पताल विभागों, डॉक्टरों की जानकारी और डिजिटल टोकन ट्रैकिंग में मदद कर सकता हूँ।"
        
        return {
            "reply": reply,
            "language": "hi",
            "disclaimer": "यह केवल सूचनात्मक सहायता है। चिकित्सकीय निर्णय डॉक्टर द्वारा ही लिया जाएगा।"
        }

    # English Response Engine
    if "appointment" in q or "token" in q or "queue" in q:
        reply = "You can book appointments under the 'Find Doctors' tab. Once confirmed, MediSense generates a live digital token (e.g. A-101) with live queue position updates!"
    elif "chest pain" in q or "heart" in q:
        reply = "Chest pain and breathing difficulty can be signs of a medical emergency. Please report to the Emergency / Cardiology department immediately."
    elif "report" in q or "blood test" in q:
        reply = "You can view diagnostic reports and AI-generated summaries under your Patient Dashboard."
    else:
        reply = "Hello! I am the MediSense AI Health Assistant. I can guide you to the right department, explain hospital digital tokens, and assist with appointment status."

    return {
        "reply": reply,
        "language": "en",
        "disclaimer": "AI-generated informational guidance. Not a medical diagnosis."
    }
