# MediSense — College Viva Defense Reference Guide
## 3rd-Year B.Tech CSE Major Project

This guide prepares you to answer questions from external examiners, professors, and viva panels.

---

## 1. PROJECT OVERVIEW & VIVA ELEVATOR PITCH

### Q1: What is MediSense?
**Answer**: "MediSense is an AI-driven healthcare intelligence and hospital operations platform focused on **Minimum-Queue Healthcare**. It eliminates physical waiting lines, manual counter visits, and uncoordinated diagnostic delays by using **Digital Tokens** and a **Live Patient Journey Digital Twin** to orchestrate sequential hospital steps with zero unnecessary waiting."

### Q2: What problem does MediSense solve?
**Answer**: "Traditional hospital management systems (HMS) only record patient data passively. MediSense actively solves operational bottleneck delays in OPD queues, bed allocation, oxygen tracking, pharmacy dispensing, and emergency room pre-arrival notifications."

---

## 2. ARCHITECTURE & TECHNOLOGY CHOICES

### Q3: Explain your project architecture.
**Answer**: "MediSense uses a clean, decoupled **3-Tier Architecture**:
1. **Frontend**: Built with React 18, Vite, and Tailwind CSS. It communicates with the backend via REST HTTP calls using Axios.
2. **Backend Gateway**: Built with Node.js and Express.js. It manages JWT authentication, input validation, MongoDB data transactions via Mongoose, and acts as an API gateway.
3. **AI Microservice**: Built with Python FastAPI, Uvicorn, and Scikit-Learn. It runs independently on port 8000 to execute ML waiting-time predictions, triage classification, and NLP processing."

### Q4: Why did you separate Python FastAPI from Node.js Express?
**Answer**: "Node.js is asynchronous and ideal for lightweight I/O operations and REST API routing. Python possesses the rich scientific ML ecosystem (Scikit-Learn, Pandas, NumPy, Gemini SDK). Decoupling them allows Node.js to stay fast and responsive while delegating heavy ML inference tasks to FastAPI via internal HTTP calls."

---

## 3. DATABASE SCHEMAS & MONGO DB RATIONALE

### Q5: Why did you choose MongoDB over SQL?
**Answer**: "Hospital operational records contain complex, nested, semi-structured documents (e.g. dynamic prescription medicine lists, flexible diagnostic test parameters, and AI summary logs). MongoDB's document-oriented JSON format allows us to nest structures cleanly without requiring expensive SQL multi-table joins."

### Q6: How do you prevent double-booking of doctor time slots?
**Answer**: "In our Mongoose `Appointment` schema, we enforced a **compound unique index**:
```javascript
appointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: true });
```
If two patients attempt to book the exact same doctor, date, and time slot simultaneously, MongoDB enforces uniqueness at the database level and throws a duplicate key error ($11000$)."

---

## 4. SECURITY & AUTHENTICATION (JWT + BCRYPT)

### Q7: How does authentication work in MediSense?
**Answer**: "We use **JSON Web Tokens (JWT)** and **bcrypt** password hashing:
1. During registration, `bcrypt.hash()` encrypts plain-text passwords with 10 salt rounds before saving to MongoDB.
2. Upon login, `bcrypt.compare()` verifies the password.
3. The server signs a stateless JWT token containing `userId` and `role` (`patient`, `doctor`, `staff`, `admin`) expiring in 30 days.
4. The React client saves the token in `localStorage` and an Axios request interceptor automatically attaches `Authorization: Bearer <token>` to all subsequent protected API requests.
5. Express middleware `protect` verifies the token, while `authorize('admin')` enforces Role-Based Access Control (RBAC)."

---

## 5. AI CLASSIFICATION (RULES vs MACHINE LEARNING vs LLM)

### Q8: External Examiner Question: *"Is this real AI or just simple IF/ELSE logic?"*
**Answer**: "MediSense explicitly segregates technology types to maintain strict academic integrity:
1. **Rule-Based Engine**: Priority queue token ordering ($\text{Critical} \rightarrow \text{High} \rightarrow \text{Medium} \rightarrow \text{Normal}$) and emergency keyword red-flag detection.
2. **Machine Learning (Scikit-Learn Regression)**: Waiting-time prediction model trained on operational feature vectors (`queue_length`, `department_code`, `hour_of_day`, `doctor_experience`) using a `RandomForestRegressor`.
3. **NLP / LLM**: Multilingual AI Health Assistant Chatbot (English + Hindi) and Medical Report Summarizer with non-diagnostic disclaimers."

---

## 6. AI SAFETY & LEGAL DISCLAIMER

### Q9: How do you handle medical liability and AI safety?
**Answer**: "MediSense follows strict healthcare software safety guidelines: AI modules **never issue binding medical diagnoses or prescribe medicines independently**. Every AI response includes a mandatory disclaimer:
> *'AI-generated preliminary prioritization. Final medical decisions belong to qualified healthcare professionals.'*
For high-risk emergency cases, AI provides preliminary triage recommendations while final clinical authority remains strictly with human medical staff."

---

## 7. CORE MODULE RECAP FOR VIVA

| Module | Technology Used | Input Data | Output Result |
| :--- | :--- | :--- | :--- |
| **Authentication** | Node, Express, JWT, Bcrypt | Email, Password, Role | Signed JWT Token & User Profile |
| **Digital Token Engine** | MongoDB, Priority Algorithm | Appointment, Priority Level | Digital Token (`A-101`), Queue Position |
| **Waiting Time ML** | Python, Scikit-Learn | Queue length, Dept, Doctor Exp | Predicted Wait Minutes (e.g. 18.5 mins) |
| **AI Triage** | FastAPI, NLP Keyword Scanner | Symptom Description | Priority Level & Recommended Dept |
| **Operations Suite** | Mongoose, React State | Bed ID, Status, Stock Qty | Updated Status Grid & Low-Stock Alerts |
| **Digital Twin** | Mongoose, React Timeline | Patient ID, Steps | Step-by-Step Progress & Exit Time |
| **Hospital Copilot** | Express, Aggregation Pipeline | Natural Language Question | Controlled DB Answer & Metrics |
| **What-If Simulator** | Express, Parametric Math | Surge Percentage (+20%) | Simulated Load Impact & Recommendations |
