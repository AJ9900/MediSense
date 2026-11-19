import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import DoctorsPage from './pages/DoctorsPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import QueueDisplay from './pages/QueueDisplay';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Dashboards
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* =========================================
              1. PUBLIC ROUTES (Accessible without login)
              ========================================= */}
          
          {/* Public Homepage - First page visitors see */}
          <Route path="/" element={<Home />} />
          
          {/* Public Doctor Directory & Search */}
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorsPage />} />
          
          {/* Public Information & Clinical Services */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Public Hospital Waiting Area Live TV Display */}
          <Route path="/queue-display" element={<QueueDisplay />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* =========================================
              2. PROTECTED ROLE-BASED DASHBOARDS
              ========================================= */}

          {/* Patient Super App Dashboard */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Dashboard defaultTab="overview" />
              </ProtectedRoute>
            }
          />

          {/* Doctor Portal Dashboard */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Command Copilot Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* General Role-Redirect Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* =========================================
              3. FALLBACK CATCH-ALL
              ========================================= */}
          {/* Unknown routes redirect cleanly to the Public Homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
