// src/App.tsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import LoginPage from '@/app/login/page';
import DashboardPage from '@/app/dashboard/page';
import NewRequestPage from '@/app/new-request/page';

export default function App() {
  // Store the token in state so if it changes, the app and header re-render
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Pass BOTH token and setToken to the Header */}
      <Header token={token} setToken={setToken} />

      <div className="flex justify-center">
        <Routes>
          <Route path="/login" element={<LoginPage setToken={setToken} />} />

          <Route
            path="/dashboard"
            element={token ? <DashboardPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/new-request"
            element={token ? <NewRequestPage /> : <Navigate to="/login" />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}