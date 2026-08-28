import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User, PlusCircle, Home, UserPlus, LogIn } from 'lucide-react';

const Navbar = ({ onOpenReportModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-semibold border border-purple-300">Admin (Councillor)</span>;
      case 'department':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-300">Dept Official</span>;
      case 'user':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-300">Citizen</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
              CivicWatch
            </span>
            <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
              Smart Issue Reporting System
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {user ? (
            <>
              {user.role === 'user' && onOpenReportModal && (
                <button
                  onClick={onOpenReportModal}
                  className="inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Report Issue
                </button>
              )}

              <div className="hidden sm:flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs text-slate-700 font-medium">
                <User className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-900">{user.name}</span>
                {getRoleBadge(user.role)}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              {location.pathname !== '/' && (
                <Link
                  to="/"
                  className="inline-flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition"
                >
                  <Home className="w-4 h-4 mr-1 text-slate-500" />
                  Home
                </Link>
              )}

              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="inline-flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition"
                >
                  <LogIn className="w-4 h-4 mr-1 text-slate-500" />
                  Login
                </Link>
              )}

              {location.pathname !== '/register' && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
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
