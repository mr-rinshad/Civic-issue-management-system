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

      // Auto navigate based on system-identified role
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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Horizontal Navbar with Home and Register buttons */}
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 text-center text-white">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-3 shadow-inner">
              <Shield className="w-8 h-8 text-blue-200" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">System Login</h2>
            <p className="text-xs text-blue-100 mt-1">
              Smart Civic Issue Reporting System Portal
            </p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center text-sm"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Helper */}
            <div className="mt-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-2">
                ⚡ Quick Fill Test Credentials:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@civic.com', 'Admin@12345')}
                  className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition font-medium text-[11px]"
                >
                  Admin Credentials
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('sanitation@civic.com', 'Dept@12345')}
                  className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition font-medium text-[11px]"
                >
                  Dept (Sanitation)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('roads@civic.com', 'Dept@12345')}
                  className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition font-medium text-[11px]"
                >
                  Dept (Roads)
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-600">
              New Citizen?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
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
