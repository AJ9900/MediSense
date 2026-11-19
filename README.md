# MediSense: AI-Driven Healthcare Intelligence & Hospital Operations Platform

> **Tagline**: Less Waiting. Smarter Care.

MediSense is a full-stack, production-ready healthcare intelligence platform designed to eliminate unnecessary physical queue waiting lines, manual counter visits, redundant paper coordination, and resource bottlenecks in modern hospital ecosystems.

---

## 🌟 Core Vision: Minimum-Queue Healthcare
Traditional hospitals suffer from severe queue congestion across patient registration, triage, consultation, diagnostic labs, radiology, and pharmacy dispensing. MediSense orchestrates end-to-end patient journeys with **Digital Tokens** and a **Live Patient Journey Digital Twin**, continuously asking:

> *"What is my next step, and how can we make it happen with zero unnecessary waiting?"*

---

## 🏗️ Architecture & Technology Stack

MediSense follows a clean, decoupled 3-tier microservice architecture:

```
+-------------------------------------------------------------+
|                 REACT FRONTEND (Vite + Tailwind)            |
|       - Patient Super App, Doctor Portal, Admin Command     |
+-------------------------------------------------------------+
                              │
                    REST HTTP (Axios + JWT)
                              ▼
+-------------------------------------------------------------+
|              NODE.JS / EXPRESS REST API GATEWAY             |
|       - RBAC Auth, Controllers, Mongoose ODM Persistence    |
+-------------------------------------------------------------+
          │                                        │
    Mongoose ODM                         Internal HTTP POST
          ▼                                        ▼
+-----------------------+        +----------------------------+
|   MONGODB DATABASE    |        |  PYTHON FASTAPI AI SERVICE |
| (Collections & Schemas)|       | - Scikit-Learn ML Models   |
+-----------------------+        | - Gemini LLM API (Chat/NLP)|
                                 +----------------------------+
```

### 1. Frontend (`client/`)
* **Framework**: React 18, Vite
* **Styling**: Tailwind CSS
* **Icons & Charts**: Lucide React, Recharts
* **State & Routing**: React Router v6, React Context API, Axios

### 2. Backend Gateway (`server/`)
* **Runtime**: Node.js, Express.js
* **Database**: MongoDB via Mongoose ODM
* **Security**: JSONWebToken (JWT), bcryptjs password hashing
* **Middleware**: CORS, Morgan, express-validator, Centralized Error Handler

### 3. AI Microservice (`ai-service/`)
* **Framework**: Python 3.10+, FastAPI, Uvicorn
* **Machine Learning**: Scikit-Learn (RandomForestRegressor model for waiting time predictions)
* **Data Processing**: Pandas, NumPy, Pydantic
* **Conversational Engine**: Multilingual Chatbot (English + Hindi) with strict non-diagnostic disclaimers

---

## 🔑 Core Features & User Roles

### 👤 Patient Super App
* **AI Patient Intake & Triage**: Symptom keyword scanner assigning priority levels (`CRITICAL`, `HIGH`, `MEDIUM`, `NORMAL`).
* **Doctor Search & Slot Booking**: Filter specialists by department, rating, and unbooked time slots.
* **Digital Token Tracker (`A-101`)**: Real-time position counter (`3 Patients Ahead`) and estimated wait time in minutes.
* **Patient Journey Digital Twin**: Step-by-step progress timeline (`Doctor` -> `Blood Test` -> `X-Ray` -> `Pharmacy`).
* **Multilingual AI Health Assistant**: Floating chatbot widget in Hindi & English.
* **Indoor Navigation Guide**: Step-by-step room and floor directions.

### 🩺 Doctor Clinical Portal
* **Consultation Queue**: Manage daily appointments and call tokens with one click.
* **Token Callout Trigger**: Send instant room callout announcements (`NOW CALLING TOKEN A-101 -> ROOM #204`).
* **Availability Toggle**: Real-time switch for doctor status (`Available Today` vs `Away`).

### 🏥 Hospital Staff Operations Suite
* **Beds & ICU Grid**: Color-coded matrix (`AVAILABLE`, `OCCUPIED`, `CLEANING`) with instant status toggles.
* **Pharmacy Stock**: Medicine batch tracking with automatic **LOW STOCK** warnings.
* **Oxygen Tank & Cylinder Tracker**: Central tank level percentage (%) gauge bar.
* **Medical Waste Logging**: Biomedical waste categorization and disposal logs.
* **Ambulance Dispatch**: Trigger **EMERGENCY PRE-ARRIVAL ALERTS** for emergency room preparation.

### 👑 Admin Command Center
* **Recharts Demand Forecasting**: 7-day OPD volume & bed occupancy projections.
* **AI Bottleneck Alerts**: Automatic notifications for radiology delays or ICU capacity spikes.
* **Hospital AI Copilot**: Natural language query engine answering operational questions.
* **What-If Load Simulator**: Test parametric load surges (`+20% patient surge impact`).
* **Public TV Lobby Display (`/queue-display`)**: Public monitor screen for hospital waiting lobbies.

---

## ⚡ Quick Start & Installation

### Prerequisites
* Node.js v18+ & npm
* Python 3.10+ & pip
* Local MongoDB server (running on `mongodb://127.0.0.1:27017`)

### 1. Seed Database (Optional)
```bash
cd server
node utils/seedData.js
```

### 2. Start Express Backend (Port 5000)
```bash
cd server
npm install
npm run dev
```

### 3. Start Python FastAPI AI Service (Port 8000)
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 4. Start React Frontend (Port 5173)
```bash
cd client
npm install
npm run dev
```

Open your web browser at **`http://localhost:5173`**!

---

## 📜 Demo Credentials for Viva Testing

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@medisense.com` | `password123` | Digital Token, Triage, Doctor Booking, Timeline |
| **Doctor** | `doctor@medisense.com` | `password123` | Consultation Queue, Call Next Token, Availability |
| **Staff** | `staff@medisense.com` | `password123` | Beds, Pharmacy, Oxygen, Waste, Ambulances |
| **Admin** | `admin@medisense.com` | `password123` | Recharts Forecast, Bottlenecks, Copilot, Simulator |

---

## ⚠️ Academic & Medical Safety Disclaimer
MediSense is a B.Tech CSE major project software platform. The AI modules provide preliminary triage prioritization and operational guidance only. **MediSense does not issue binding medical diagnoses or replace licensed physicians.** All high-risk clinical decisions require human medical staff verification.
