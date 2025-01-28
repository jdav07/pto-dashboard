// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/routes/Layout';
import { LoginRoute } from '@/routes/LoginRoute';
import { DashboardRoute } from '@/routes/DashboardRoute';
import { NewRequestRoute } from '@/routes/NewRequestRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/new-request" element={<NewRequestRoute />} />
        {/* Redirect root to login or dashboard based on auth status */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}