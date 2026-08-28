import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  FileText,
  Building2,
  PlusCircle,
  LogOut,
  User,
  Menu,
  X,
  Home,
  CheckCircle2,
} from 'lucide-react';

const SidebarLayout = ({ children, onOpenReportModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="bg-purple-500/20 text-purple-200 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-purple-400/30">
            Councillor Admin
          </span>
        );
      case 'department':
        return (
          <span className="bg-amber-500/20 text-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-400/30">
            {user?.departmentName || 'Dept Official'}
          </span>
        );
      case 'user':
        return (
          <span className="bg-emerald-500/20 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-400/30">
            Citizen
          </span>
        );
      default:
        return null;
    }
  };

  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === 'admin') {
      return [
        { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Home Page', path: '/', icon: Home },
      ];
    }
    if (user.role === 'department') {
      return [
        { name: 'Dept Dashboard', path: '/department', icon: Building2 },
        { name: 'Home Page', path: '/', icon: Home },
      ];
    }
    return [
      { name: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Home Page', path: '/', icon: Home },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-white">CivicWatch</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Side Navbar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 h-screen ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo & Title */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-tight leading-tight">CivicWatch</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Civic Issue System</p>
            </div>
          </div>

          {/* User Info Card */}
          {user && (
            <div className="mx-4 my-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  {getRoleBadge(user.role)}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5 mt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {link.name}
                </Link>
              );
            })}

            {/* Quick Action Button for Citizen */}
            {user?.role === 'user' && onOpenReportModal && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenReportModal();
                }}
                className="w-full mt-4 flex items-center justify-center px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Report Civic Issue
              </button>
            )}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-xs"
        ></div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
