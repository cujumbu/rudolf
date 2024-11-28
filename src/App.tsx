import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedLayout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { TimeClock } from './pages/TimeClock';
import { EmployeeManagementPage } from './pages/EmployeeManagementPage';
import { TimeEntriesPage } from './pages/TimeEntriesPage';
import { useAuthStore } from './stores/authStore';

export const App: React.FC = () => {
  const { user, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route for time clock */}
        <Route path="/clock" element={<TimeClock />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected admin routes */}
        <Route element={<ProtectedLayout />}>
          <Route
            path="/admin"
            element={
              user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin/employees"
            element={
              user?.role === 'admin' ? <EmployeeManagementPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin/time-entries"
            element={
              user?.role === 'admin' ? <TimeEntriesPage /> : <Navigate to="/login" replace />
            }
          />
        </Route>

        {/* Redirect root to appropriate page */}
        <Route
          path="/"
          element={
            user?.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/clock" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}