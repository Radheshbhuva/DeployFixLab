import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize default mock admin session for immediate dev preview
import { useAuthStore } from './store/authStore';

if (!useAuthStore.getState().user) {
  useAuthStore.getState().setUser(
    {
      id: 'usr-admin-1',
      email: 'admin@deployfix.lab',
      fullName: 'Radhesh Bhuva',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    },
    'mock-dev-jwt-token-initial'
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
