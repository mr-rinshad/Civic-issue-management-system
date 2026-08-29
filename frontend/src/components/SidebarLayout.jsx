import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Home,
  Users,
  UserCog,
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
          <span className="bg-[#CCFF00]/20 text-[#CCFF00] text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-[#CCFF00]/30">
            Councillor Admin
          </span>
        );
      case 'department':
        return (
          <span className="bg-[#FFFF00]/20 text-[#FFFF00] text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-[#FFFF00]/30">
            {user?.departmentName || 'Dept Official'}
          </span>
        );
      case 'user':
        return (
          <span className="bg-[#DFFF00]/20 text-[#DFFF00] text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-[#DFFF00]/30">
            Citizen
          </span>
        );
      default:
        return null;
    }
  };

  const getModuleNameOnly = (role) => {
    if (role === 'admin') return 'Councillor Admin';
    if (role === 'department') return `${user?.departmentName || 'Department'} Module`;
    return 'Citizen Module';
  };

  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === 'admin') {
      return [
        { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Manage Citizens', path: '/admin/citizens', icon: Users },
        { name: 'My Profile', path: '/profile', icon: UserCog },
      ];
    }
    if (user.role === 'department') {
      return [
        { name: 'Dept Dashboard', path: '/department', icon: Building2 },
        { name: 'My Profile', path: '/profile', icon: UserCog },
      ];
    }
    return [
      { name: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'My Profile', path: '/profile', icon: UserCog },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col md:flex-row selection:bg-[#CCFF00] selection:text-black">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-zinc-950 text-white p-4 flex items-center justify-between sticky top-0 z-50 border-b border-[#CCFF00]/20 backdrop-blur-xl">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#CCFF00]/40">
            <img src="/fixmycity_logo.jpg" alt="FixMyCity Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-sm text-white tracking-wider">
            FixMy<span className="text-[#CCFF00]">City</span>
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-[#CCFF00] rounded-xl text-xs font-bold flex items-center"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            Home
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-[#CCFF00] border border-zinc-800"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Side Navbar (Home Button Completely Removed) */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-zinc-950/90 backdrop-blur-2xl text-zinc-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 h-screen border-r border-[#CCFF00]/20 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand AI Logo & Title */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#CCFF00]/40 shadow-[0_0_15px_rgba(204,255,0,0.3)] shrink-0 bg-black">
                <img src="/fixmycity_logo.jpg" alt="FixMyCity Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-black text-base text-white tracking-tight leading-tight">
                  FixMy<span className="text-[#CCFF00]">City</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="mx-4 my-4 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center font-black text-sm shrink-0">
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
          <nav className="px-3 space-y-2 mt-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-black' : 'text-[#CCFF00]'}`} />
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
                className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#CCFF00] to-[#DFFF00] hover:from-[#FFFF00] hover:to-[#CCFF00] text-black font-black rounded-xl text-xs shadow-[0_0_15px_rgba(204,255,0,0.3)] transition"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Report Civic Issue
              </button>
            )}
          </nav>
        </div>

        {/* Bottom Action: ONLY Sign Out (Home button removed as requested) */}
        <div className="p-4 border-t border-zinc-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition border border-transparent hover:border-red-500/20"
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
          className="fixed inset-0 z-30 bg-black/80 md:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* Main Content Viewport with Top Horizontal Navbar */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Horizontal Bar inside Module: Home Button + Module Name on Right Side */}
        <header className="bg-black/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          {/* Brand Logo & Name on Left */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#CCFF00]/40">
              <img src="/fixmycity_logo.jpg" alt="FixMyCity Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-black text-white tracking-tight">
              FixMy<span className="text-[#CCFF00]">City</span>
            </span>
          </div>

          {/* Right Side: Home Button + Module Name Badge on the Right Side of Home Button */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-[#CCFF00] border border-zinc-800 rounded-xl text-xs font-bold transition flex items-center shadow-xs"
            >
              <Home className="w-3.5 h-3.5 mr-1.5 text-[#CCFF00]" />
              Home
            </Link>

            {/* Module Name badge positioned directly on right side of Home button */}
            <span className="px-3.5 py-1.5 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-black rounded-xl uppercase tracking-wider shadow-[0_0_10px_rgba(204,255,0,0.15)]">
              {getModuleNameOnly(user?.role)}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
