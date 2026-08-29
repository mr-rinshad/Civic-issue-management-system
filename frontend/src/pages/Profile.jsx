import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SidebarLayout from '../components/SidebarLayout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, CheckCircle2, AlertCircle, Key, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!name.trim()) {
      setProfileError('Name cannot be empty.');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await API.put('/auth/profile', { name, phone });
      if (res.data.success) {
        setProfileSuccess('Profile details updated successfully!');
      }
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in both current and new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await API.put('/auth/password', { currentPassword, newPassword });
      if (res.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="bg-[#CCFF00]/20 text-[#CCFF00] text-xs px-3 py-1 rounded-full font-black border border-[#CCFF00]/30 uppercase">
            Councillor Admin
          </span>
        );
      case 'department':
        return (
          <span className="bg-[#FFFF00]/20 text-[#FFFF00] text-xs px-3 py-1 rounded-full font-black border border-[#FFFF00]/30 uppercase">
            Dept Official ({user?.departmentName})
          </span>
        );
      case 'user':
        return (
          <span className="bg-[#DFFF00]/20 text-[#DFFF00] text-xs px-3 py-1 rounded-full font-black border border-[#DFFF00]/30 uppercase">
            Citizen User
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white p-6 sm:p-8 rounded-3xl border border-[#CCFF00]/30 shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center font-black text-2xl">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-black">{user?.name}</h1>
              <p className="text-xs text-zinc-400 mt-0.5">{user?.email}</p>
              <div className="mt-2">{getRoleBadge(user?.role)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-950/80 p-6 rounded-3xl border border-zinc-800 shadow-sm backdrop-blur-2xl text-white">
            <h2 className="text-base font-black uppercase mb-1 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#CCFF00]" />
              Update Personal Details
            </h2>
            <p className="text-xs text-zinc-400 mb-5">Update your display name and mobile contact number.</p>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs rounded-xl flex items-center font-bold">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-[#CCFF00]" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center font-bold">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-400" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Email Address (Read-Only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900/50 border border-zinc-800 text-zinc-500 rounded-xl text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full py-3 bg-[#CCFF00] hover:bg-[#FFFF00] text-black font-extrabold rounded-xl shadow-md transition text-xs uppercase"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          <div className="bg-zinc-950/80 p-6 rounded-3xl border border-zinc-800 shadow-sm backdrop-blur-2xl text-white">
            <h2 className="text-base font-black uppercase mb-1 flex items-center">
              <Key className="w-5 h-5 mr-2 text-[#CCFF00]" />
              Change Password
            </h2>
            <p className="text-xs text-zinc-400 mb-5">Ensure your account uses a strong password.</p>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs rounded-xl flex items-center font-bold">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-[#CCFF00]" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center font-bold">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-400" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full py-3 bg-[#CCFF00] hover:bg-[#FFFF00] text-black font-extrabold rounded-xl shadow-md transition text-xs uppercase"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Profile;
