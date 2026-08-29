import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, UserPlus, LogIn, Sparkles, Activity } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div className="h-screen w-screen overflow-hidden bg-[#050505] text-white flex flex-col justify-between relative selection:bg-[#CCFF00] selection:text-black">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFFF00]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Horizontal Navbar (No Home button rendered on Home page) */}
      <Navbar />

      {/* Hero Single Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto py-4 z-10 overflow-hidden">
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          <div className="inline-flex items-center space-x-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#CCFF00] w-fit shadow-[0_0_15px_rgba(204,255,0,0.2)]">
            <Sparkles className="w-4 h-4 text-[#CCFF00] animate-pulse" />
            <span className="tracking-wide">SMART CIVIC INFRASTRUCTURE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase text-white">
            FIX MY <span className="bg-gradient-to-r from-[#CCFF00] via-[#FFFF00] to-[#DFFF00] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(204,255,0,0.4)]">CITY</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
            Report infrastructure hazards, garbage accumulation, streetlight faults, and water leaks directly to councillor admins and municipal field operations.
          </p>

          {/* Active Logged-In Module Access */}
          {user ? (
            <div className="p-4 rounded-2xl bg-zinc-950/90 border border-[#CCFF00]/40 backdrop-blur-xl shadow-[0_0_25px_rgba(204,255,0,0.15)] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#CCFF00] block">
                  Active Logged-In Account
                </span>
                <h3 className="text-sm font-extrabold text-white mt-0.5">
                  Logged in as <span className="text-[#CCFF00]">{user.name}</span>
                </h3>
              </div>
              <button
                onClick={() => navigate(getModuleRoute(user.role))}
                className="px-4 py-2.5 bg-gradient-to-r from-[#CCFF00] to-[#DFFF00] hover:from-[#FFFF00] hover:to-[#CCFF00] text-black font-black text-xs rounded-xl shadow-lg transition flex items-center shrink-0 uppercase tracking-wider"
              >
                <span>{getModuleNameOnly(user.role)}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#CCFF00] to-[#DFFF00] hover:from-[#FFFF00] hover:to-[#CCFF00] text-black font-black rounded-2xl shadow-[0_0_25px_rgba(204,255,0,0.35)] transition flex items-center justify-center text-xs tracking-wider uppercase"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span>Register Citizen</span>
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold rounded-2xl border border-zinc-700 hover:border-[#CCFF00]/50 backdrop-blur-xl transition flex items-center justify-center text-xs tracking-wider uppercase"
              >
                <LogIn className="w-4 h-4 mr-2 text-[#CCFF00]" />
                <span>System Login</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: AI Generated Hero Image */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <div className="relative w-full max-w-lg aspect-video lg:aspect-4/3 rounded-3xl p-2 bg-gradient-to-tr from-[#CCFF00]/40 via-zinc-800/50 to-[#FFFF00]/30 backdrop-blur-2xl border border-[#CCFF00]/30 shadow-[0_0_40px_rgba(204,255,0,0.2)] overflow-hidden group">
            <img
              src="/civic_hero_glass.jpg"
              alt="FixMyCity AI City Hologram"
              className="w-full h-full object-cover rounded-2xl border border-zinc-800 group-hover:scale-102 transition duration-500"
            />

            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-[#CCFF00]/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-md overflow-hidden border border-[#CCFF00]/50">
                  <img src="/fixmycity_logo.jpg" alt="FixMyCity" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-black text-white tracking-wide">
                  FixMy<span className="text-[#CCFF00]">City</span> Platform
                </span>
              </div>
              <span className="text-[10px] font-black text-black bg-[#CCFF00] px-2 py-0.5 rounded uppercase">
                Active System
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Minimalist Strip */}
      <footer className="py-3 bg-black/90 border-t border-zinc-900 text-center text-[11px] text-zinc-500 font-medium z-10">
        FixMyCity © {new Date().getFullYear()} • Smart Municipal Infrastructure Platform
      </footer>
    </div>
  );
};

export default Home;
