import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import UniversalLogin from './pages/UniversalLogin';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentDashboard from './pages/DepartmentDashboard';
import Profile from './pages/Profile';
import ManageCitizens from './pages/ManageCitizens';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UniversalLogin />} />
          <Route path="/register" element={<Register />} />

          {/* User Module */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Module */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/citizens"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageCitizens />
              </ProtectedRoute>
            }
          />

          {/* Department Module */}
          <Route
            path="/department"
            element={
              <ProtectedRoute allowedRoles={['department', 'admin']}>
                <DepartmentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Common Profile Page for All Authenticated Users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'department']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
