import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Shield,
  MapPin,
  Camera,
  CheckCircle2,
  Building2,
  UserCheck,
  Wrench,
  ArrowRight,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex-1 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-300 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Empowering Citizens & Local Municipal Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Smart Civic Issue <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Reporting System</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A centralized civic management platform enabling citizens to report infrastructure hazards, garbage accumulation, broken streetlights, and water leaks directly to local councillor admins and municipal field departments.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-blue-500/25 transition flex items-center justify-center text-sm"
            >
              <span>Register as Citizen</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md transition flex items-center justify-center text-sm"
            >
              <span>Access System Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900">Supported Civic Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2 font-bold">
                🕳️
              </div>
              <span className="text-xs font-bold text-slate-800">Potholes & Roads</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 font-bold">
                🗑️
              </div>
              <span className="text-xs font-bold text-slate-800">Garbage Accumulation</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mx-auto mb-2 font-bold">
                💡
              </div>
              <span className="text-xs font-bold text-slate-800">Broken Streetlights</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 font-bold">
                💧
              </div>
              <span className="text-xs font-bold text-slate-800">Water Leaks</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2 font-bold">
                🏗️
              </div>
              <span className="text-xs font-bold text-slate-800">Infrastructure</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
