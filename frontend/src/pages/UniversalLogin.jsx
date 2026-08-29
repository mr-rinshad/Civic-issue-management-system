import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const UniversalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      setIsSubmitting(false);

      if (res.user.role === 'admin') {
        navigate('/admin');
      } else if (res.user.role === 'department') {
        navigate('/department');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || err.message || 'Login failed. Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#CCFF00] selection:text-black relative">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full bg-zinc-950/80 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(204,255,0,0.15)] border border-[#CCFF00]/30 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-black p-8 text-center border-b border-zinc-800">
            <div className="inline-flex p-3 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 mb-3 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
              <Shield className="w-8 h-8 text-[#CCFF00]" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">System Portal Login</h2>
            <p className="text-xs text-[#DFFF00]/70 mt-1 font-medium">
              Smart Civic Issue Reporting System Portal
            </p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-5 h-5 text-[#CCFF00]/70" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-[#CCFF00] focus:border-[#CCFF00] transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-5 h-5 text-[#CCFF00]/70" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-[#CCFF00] focus:border-[#CCFF00] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#CCFF00] to-[#DFFF00] hover:from-[#FFFF00] hover:to-[#CCFF00] text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.3)] transition disabled:opacity-50 flex items-center justify-center text-xs uppercase tracking-wider"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Helper */}
            <div className="mt-6 p-3.5 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <span className="text-[10px] font-extrabold text-[#CCFF00] uppercase tracking-wider block mb-2">
                ⚡ Quick Fill Credentials:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@civic.com', 'Admin@12345')}
                  className="px-2.5 py-1 bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/40 rounded-lg hover:bg-[#CCFF00]/30 transition font-bold text-[11px]"
                >
                  Admin Credentials
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('sanitation@civic.com', 'Dept@12345')}
                  className="px-2.5 py-1 bg-[#FFFF00]/20 text-[#FFFF00] border border-[#FFFF00]/40 rounded-lg hover:bg-[#FFFF00]/30 transition font-bold text-[11px]"
                >
                  Dept (Sanitation)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('roads@civic.com', 'Dept@12345')}
                  className="px-2.5 py-1 bg-[#DFFF00]/20 text-[#DFFF00] border border-[#DFFF00]/40 rounded-lg hover:bg-[#DFFF00]/30 transition font-bold text-[11px]"
                >
                  Dept (Roads)
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-zinc-400">
              New Citizen?{' '}
              <Link to="/register" className="font-bold text-[#CCFF00] hover:underline">
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UniversalLogin;
