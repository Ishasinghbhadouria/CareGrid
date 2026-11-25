/**
 * CareGrid API Service Layer
 * Connects frontend to Express.js REST API on http://localhost:5000
 * Includes automatic resilience fallback for smooth presentation mode.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

// Retrieve stored token
export const getStoredToken = () => {
  return localStorage.getItem('caregrid_auth_token') || '';
};

// Store token
export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('caregrid_auth_token', token);
  } else {
    localStorage.removeItem('caregrid_auth_token');
  }
};

// Generic API caller with JWT injection
async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.warn(`[CareGrid API] Network call to ${endpoint} failed, utilizing local state:`, err.message);
    return { ok: false, status: 0, error: err.message };
  }
}

// Auth Endpoints
export const authApi = {
  register: (payload) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  demoSwitch: (role) => request(`/auth/demo-switch/${role}`, { method: 'POST' })
};

// Appointments Endpoints
export const appointmentApi = {
  getAll: () => request('/appointments', { method: 'GET' }),
  create: (appointmentData) => request('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  }),
  updateStatus: (id, status) => request(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
};

// Medical Records Endpoints
export const recordApi = {
  getAll: () => request('/records', { method: 'GET' }),
  create: (recordData) => request('/records', {
    method: 'POST',
    body: JSON.stringify(recordData)
  })
};

// Queue Endpoints
export const queueApi = {
  getStatus: () => request('/queue/status', { method: 'GET' })
};

// Emergency SOS Endpoints
export const emergencyApi = {
  triggerSos: (payload) => request('/emergency/sos', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateStage: (payload) => request('/emergency/stage', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  getStatus: () => request('/emergency/status', { method: 'GET' })
};

// System Health Check
export const checkBackendHealth = () => request('/health', { method: 'GET' });

