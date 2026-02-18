import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Target, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';
import { authApi } from '@/features/auth/api';
import { useToast } from '@/shared/hooks/useToast';

export default function Layout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
      showToast('Logged out successfully', 'success');
    }
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/goals', label: 'Goals', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <span className="heading-font text-xl font-bold">Goal Life Planner</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === to
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {user && (
                <span className="hidden sm:block text-sm text-white/80">
                  Hi, {user.display_name}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex sm:hidden gap-1 pb-3">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
