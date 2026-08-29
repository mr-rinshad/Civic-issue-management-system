import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, UserPlus, LogIn, ArrowRight } from 'lucide-react';

const Navbar = ({ onOpenReportModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getModuleRoute = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'department') return '/department';
    return '/dashboard';
  };

  const getModuleNameOnly = (role) => {
    if (role === 'admin') return 'Councillor Admin';
    if (role === 'department') return `${user?.departmentName || 'Department'} Module`;
    return 'Citizen Module';
  };

  return (
    <header className="bg-black/90 backdrop-blur-2xl border-b border-[#CCFF00]/20 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand AI Logo & Name */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#CCFF00]/40 shadow-[0_0_15px_rgba(204,255,0,0.4)] group-hover:scale-105 transition bg-black">
            <img src="/fixmycity_logo.jpg" alt="FixMyCity Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-[#CCFF00] transition">
              FixMy<span className="text-[#CCFF00]">City</span>
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Render Home button ONLY if NOT on Home page */}
          {location.pathname !== '/' && (
            <Link
              to="/"
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-xl text-zinc-300 hover:text-[#CCFF00] hover:bg-zinc-900 border border-zinc-800 transition"
            >
              <Home className="w-4 h-4 mr-1.5 text-[#CCFF00]" />
              Home
            </Link>
          )}

          {user ? (
            <>
              {/* Module Name Button */}
              <button
                onClick={() => navigate(getModuleRoute(user.role))}
                className="inline-flex items-center px-4 py-2 text-xs font-black rounded-xl text-black bg-gradient-to-r from-[#CCFF00] to-[#DFFF00] hover:from-[#FFFF00] hover:to-[#CCFF00] transition shadow-[0_0_15px_rgba(204,255,0,0.3)]"
              >
                <span>{getModuleNameOnly(user.role)}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-xs font-bold text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition"
                >
                  <LogIn className="w-4 h-4 mr-1.5 text-[#CCFF00]" />
                  Login
                </Link>
              )}

              {location.pathname !== '/register' && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-xs font-black text-black bg-gradient-to-r from-[#CCFF00] to-[#DFFF00] hover:from-[#FFFF00] hover:to-[#CCFF00] rounded-xl transition shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Register Citizen
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
