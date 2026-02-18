import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/authStore';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    // Only verify auth on the initial boot (isLoading = true).
    // After login/logout the store is already up-to-date — no re-check needed.
    if (!isLoading) return;
    authApi
      .getMe()
      .then((user) => setUser(user))
      .catch(() => clearAuth());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
