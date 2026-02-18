import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/authStore';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    authApi
      .getMe()
      .then((user) => setUser(user))
      .catch(() => clearAuth());
  }, [setUser, clearAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
