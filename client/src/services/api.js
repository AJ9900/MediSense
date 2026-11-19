/**
 * Axios Centralized API Client & Request Interceptor
 * 
 * Concept: Axios interceptors allow us to modify outgoing requests (e.g. adding the JWT Bearer token)
 * and catch incoming responses before they are handled by component code.
 */

import axios from 'axios';

// Create configured Axios instance
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token from localStorage to Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medisense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 Unauthorized errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid token if expired/unauthorized
      localStorage.removeItem('medisense_token');
      localStorage.removeItem('medisense_user');
    }
    return Promise.reject(error);
  }
);

export default API;
