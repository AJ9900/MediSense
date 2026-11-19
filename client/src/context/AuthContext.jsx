/**
 * Authentication React Context & Provider
 * 
 * Concept: React Context provides a way to pass data through the component tree 
 * without having to pass props down manually at every level.
 */

import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on application mount
  useEffect(() => {
    const savedToken = localStorage.getItem('medisense_token');
    const savedUser = localStorage.getItem('medisense_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse cached user payload:', err);
        localStorage.removeItem('medisense_token');
        localStorage.removeItem('medisense_user');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { data } = response.data;

      setUser(data);
      setToken(data.token);

      localStorage.setItem('medisense_token', data.token);
      localStorage.setItem('medisense_user', JSON.stringify(data));

      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      const { data } = response.data;

      setUser(data);
      setToken(data.token);

      localStorage.setItem('medisense_token', data.token);
      localStorage.setItem('medisense_user', JSON.stringify(data));

      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medisense_token');
    localStorage.removeItem('medisense_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
