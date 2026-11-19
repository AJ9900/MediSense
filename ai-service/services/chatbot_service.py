"""
MediSense AI Health Assistant Chatbot Service
Supports both Gemini API (LLM) and an advanced Multi-Intent Healthcare NLP Engine.
"""

import os
import random
import re
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Diverse greeting variations
GREETINGS_EN = [
    "Hello! How can I assist you with hospital services, departments, or OPD tokens today?",
    "Hi there! I'm your MediSense Health Assistant. Need help finding a specialist, booking an appointment, or tracking a token?",
    "Greetings! How can I help you today? You can ask about our clinical departments, doctors, or describe symptoms for guidance."
]

GREETINGS_HI = [
    "नमस्ते! मैं मेडीसेंस एआई स्वास्थ्य सहायक हूँ। आज मैं अस्पताल सेवाओं, डॉक्टरों या टोकन में आपकी क्या सहायता कर सकता हूँ?",
    "नमस्कार! क्या आप किसी डॉक्टर से परामर्श करना चाहते हैं, या अपनी बीमारी के अनुसार सही विभाग जानना चाहते हैं?",
]

# Clinical department knowledge base
DEPARTMENT_ROUTING = [
    {
        "keywords": ["chest pain", "heart", "cardio", "bp", "blood pressure", "palpitation", "cholesterol", "attack", "cardiac"],
        "dept": "Cardiology",
        "doctor": "Dr. Vikram Sharma",
        "room": "Room 204",
        "priority": "HIGH / EMERGENCY",
        "advice": "Chest discomfort or cardiac symptoms require prompt medical attention. Please proceed to Cardiology (Room 204) or the 24/7 Emergency Wing immediately."
    },
    {
        "keywords": ["headache", "migraine", "brain", "neuro", "seizure", "numbness", "dizziness", "nerve", "paralysis"],
        "dept": "Neurology",
        "doctor": "Dr. Neha Sengupta",
        "room": "Room 302",
        "priority": "MEDIUM",
        "advice": "Neurological symptoms like persistent headaches, dizziness, or nerve pain are evaluated in our Neurology Department (Room 302)."
    },
    {
        "keywords": ["fever", "cold", "cough", "flu", "weakness", "infection", "diabetes", "sugar", "tired", "fatigue", "vomiting", "stomach", "acidity", "loose motion", "diarrhea"],
        "dept": "General Medicine",
        "doctor": "Dr. Arvind Rao",
        "room": "Room 105",
        "priority": "NORMAL",
        "advice": "For common symptoms such as fever, viral infections, or diabetes management, please visit General Medicine (Room 105)."
    },
    {
        "keywords": ["child", "baby", "pediatric", "infant", "vaccine", "vaccination", "kid", "toddler"],
        "dept": "Pediatrics",
        "doctor": "Dr. Pooja Nair",
        "room": "Room 108",
        "priority": "NORMAL",
        "advice": "For infant care, child health checkups, and vaccinations, our Pediatrics OPD is located in Room 108."
    },
    {
        "keywords": ["bone", "joint", "fracture", "knee", "spine", "ortho", "sprain", "arthritis", "back pain", "shoulder"],
        "dept": "Orthopedics",
        "doctor": "Dr. Sameer Kulkarni",
        "room": "Room 210",
        "priority": "NORMAL",
        "advice": "Bone, joint, spine, or sports injury concerns are treated in the Orthopedics Department (Room 210)."
    },
    {
        "keywords": ["skin", "rash", "acne", "allergy", "itching", "derma", "hair", "scalp", "eczema", "burn"],
        "dept": "Dermatology",
        "doctor": "Dr. Aditi Mehra",
        "room": "Room 112",
        "priority": "NORMAL",
        "advice": "For skin allergies, rashes, acne, and dermatological conditions, visit Dermatology in Room 112."
    }
]

def try_gemini_api(prompt: str, language: str = "en") -> str:
    """Attempts to call Gemini API if an API key is configured."""
    if not GEMINI_API_KEY or "your_gemini" in GEMINI_API_KEY.lower():
        return None
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        system_instruction = (
            "You are MediSense AI Health Assistant, a helpful assistant for MediSense Hospital. "
            "Help patients understand hospital departments, OPD tokens, and appointment booking. "
            "Never issue a definitive clinical diagnosis. Always give supportive, clear, concise guidance."
        )
        if language == "hi":
            system_instruction += " Answer in Hindi language."
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{system_instruction}\n\nPatient Query: {prompt}"}
                    ]
                }
            ]
        }
        with httpx.Client(timeout=8.0) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text.strip()
    except Exception as e:
        print(f"[Chatbot Gemini Error]: {e}")
    return None

def generate_chatbot_response(query: str, language: str = "en"):
    q = query.strip().lower()

    # 1. Try Gemini LLM if configured
    llm_reply = try_gemini_api(query, language)
    if llm_reply:
        return {
            "reply": llm_reply,
            "language": language,
            "disclaimer": "AI-generated informational guidance. Not a medical diagnosis."
        }

    # 2. Hindi Language Engine
    is_hindi = language == "hi" or any(h in q for h in ["नमस्ते", "कैसे", "डॉक्टर", "दर्द", "दवा", "टोकन", "अस्पताल", "मदद"])
    if is_hindi:
        if any(greet in q for greet in ["नमस्ते", "हेलो", "hlo", "hi", "hello", "namaste", "pranam"]):
            reply = random.choice(GREETINGS_HI)
        elif any(w in q for w in ["अपॉइंटमेंट", "appointment", "booking", "बुक"]):
            reply = "आप 'Find Doctors' पेज पर जाकर किसी भी डॉक्टर के उपलब्ध स्लॉट देख सकते हैं और बिना कतार के डिजिटल अपॉइंटमेंट बुक कर सकते हैं।"
        elif any(w in q for w in ["token", "टोकन", "queue", "कतार"]):
            reply = "मेडीसेंस डिजिटल टोकन सिस्टम (जैसे #M1001) आपको लाइव वेटिंग टाइम बताता है। आपका नंबर आने पर स्क्रीन और ऐप पर नोटिफिकेशन आता है।"
        elif any(w in q for w in ["सीने", "दिल", "heart", "chest"]):
            reply = "सीने में दर्द या सांस की परेशानी गंभीर हो सकती है। कृपया तुरंत कार्डियोलॉजी विभाग (कमरा 204) या इमरजेंसी वार्ड में संपर्क करें।"
        elif any(w in q for w in ["बुखार", "सर्दी", "खांसी", "सिरदर्द", "fever"]):
            reply = "बुखार, सर्दी या सामान्य कमजोरी के लिए आप जनरल मेडिसिन (General Medicine - कमरा 105, डॉ. अरविंद राव) से परामर्श ले सकते हैं।"
        elif any(w in q for w in ["हड्डी", "जोड़", "कमर", "bone"]):
            reply = "हड्डियों या जोड़ों के दर्द के लिए ऑर्थोपेडिक्स विभाग (Orthopedics - कमरा 210, डॉ. समीर कुलकर्णी) में दिखाएं।"
        else:
            reply = "मैं मेडीसेंस एआई सहायक हूँ। आप मुझसे अपॉइंटमेंट, डॉक्टर, टोकन या अपनी बीमारी के अनुसार सही विभाग (जैसे कार्डियोलॉजी, न्यूरोलॉजी, बाल रोग) के बारे में पूछ सकते हैं।"
        
        return {
            "reply": reply,
            "language": "hi",
            "disclaimer": "यह केवल सूचनात्मक सहायता है। आपातकाल में तुरंत नजदीकी अस्पताल जाएं।"
        }

    # 3. English Language Multi-Intent Engine

    # A. Casual Greetings
    if re.match(r"^(hi|hello|hlo|hey|heya|hiya|good morning|good afternoon|good evening|sup)\b", q):
        reply = random.choice(GREETINGS_EN)
        return {
            "reply": reply,
            "language": "en",
            "disclaimer": "Informational guidance only. Not a medical diagnosis."
        }

    # B. How are you / Identity questions
    if any(phrase in q for phrase in ["how are you", "who are you", "what can you do", "help me"]):
        reply = (
            "I'm MediSense AI Health Assistant! I can help you find specialists, guide you to the right "
            "hospital department based on symptoms, explain your digital token status, and guide you on appointment bookings."
        )
        return {
            "reply": reply,
            "language": "en",
            "disclaimer": "Informational guidance only."
        }

    # C. Appointment & Booking Queries
    if any(w in q for w in ["appointment", "book a doctor", "schedule", "consultation", "booking", "slot"]):
        reply = (
            "To book a consultation: Click 'Find Doctors' in the navigation bar, browse our certified specialists "
            "by department, choose an available date and time slot, and confirm. Your live OPD digital token will be issued instantly!"
        )
        return {
            "reply": reply,
            "language": "en",
            "disclaimer": "Informational guidance only."
        }

    # D. Digital Token & Queue Inquiries
    if any(w in q for w in ["token", "queue", "wait time", "waiting", "turn", "live queue", "display"]):
        reply = (
            "MediSense operates a Minimum-Queue Digital Token system! When you book an appointment or check in, "
            "you receive a live token (e.g. #M1001). Our ML model calculates estimated waiting minutes, and tokens are called directly on lobby screens and your dashboard."
        )
        return {
            "reply": reply,
            "language": "en",
            "disclaimer": "Informational guidance only."
        }

    # E. Emergency / Urgent Care
    if any(w in q for w in ["emergency", "ambulance", "accident", "bleeding", "severe", "urgent"]):
        reply = (
            "🚨 For medical emergencies, please visit the Hospital Emergency & Trauma Care Unit on the Ground Floor immediately, "
            "or contact our 24/7 Emergency Dispatch Helpline at +91 98765 43210."
        )
        return {
            "reply": reply,
            "language": "en",
            "disclaimer": "Emergency alert: Seek immediate in-person medical care."
        }

    # F. Clinical Department Routing based on Symptoms
    for dept_info in DEPARTMENT_ROUTING:
        for kw in dept_info["keywords"]:
            if kw in q:
                reply = (
                    f"Based on your mention of '{kw}', we recommend consulting our **{dept_info['dept']} Department** "
                    f"({dept_info['room']}) led by {dept_info['doctor']}. {dept_info['advice']} "
                    f"You can book a slot directly via the 'Find Doctors' tab."
                )
                return {
                    "reply": reply,
                    "language": "en",
                    "disclaimer": "AI-generated departmental triage guidance. Not a clinical diagnosis."
                }

    # G. Hospital Timings & Information
    if any(w in q for w in ["timing", "hours", "open", "time", "schedule"]):
        reply = (
            "MediSense OPD operates Monday through Saturday, from 09:00 AM to 05:00 PM. "
            "The Emergency Department, Trauma Care, and Inpatient Services are open 24 hours a day, 7 days a week."
        )
        return {
            "reply": reply,
            "language": "en",
            "disclaimer": "Informational guidance only."
        }

    # H. Reports & Prescriptions
    if any(w in q for w in ["report", "blood test", "lab", "prescription", "xray", "scan", "test result"]):
        reply = (
            "You can review your uploaded medical reports, laboratory test summaries, and doctor prescriptions "
            "securely within your Patient Dashboard under the 'Medical Records' section."
        )
        return {
            "reply": reply,
            "language": "en",
            "disclaimer": "Informational guidance only."
        }

    # I. Engaging Fallback (Instead of repeating the same greeting)
    reply = (
        f"I understand you're inquiring about '{query}'. To assist you best, you can:\n"
        "• Tell me your symptoms (e.g. fever, headache, joint pain) to find the right department\n"
        "• Ask how to book a specialist appointment or track your digital token\n"
        "• Check hospital timings or emergency care details."
    )
    return {
        "reply": reply,
        "language": "en",
        "disclaimer": "AI-generated informational guidance. Not a medical diagnosis."
    }
