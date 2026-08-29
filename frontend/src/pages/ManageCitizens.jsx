import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SidebarLayout from '../components/SidebarLayout';
import { UserCheck, ShieldAlert, Search, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const ManageCitizens = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCitizens = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/citizens');
      if (res.data.success) {
        setCitizens(res.data.citizens);
      }
    } catch (error) {
      console.error('Error fetching citizens:', error);
      setActionError('Error loading citizens list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  const handleToggleSuspend = async (citizen) => {
    setActionSuccess('');
    setActionError('');
    const newStatus = !citizen.isSuspended;

    try {
      setUpdatingId(citizen._id);
      const res = await API.put(`/auth/citizens/${citizen._id}/suspend`, {
        isSuspended: newStatus,
      });

      if (res.data.success) {
        setActionSuccess(
          `Citizen account for ${citizen.name} has been ${newStatus ? 'SUSPENDED' : 'REACTIVATED'}.`
        );
        fetchCitizens();
      }
    } catch (error) {
      setActionError(error.response?.data?.message || 'Error updating citizen account status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCitizens = citizens.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.phone && c.phone.includes(query))
    );
  });

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-3xl p-6 border border-[#CCFF00]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#CCFF00] block mb-1">
              Councillor Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Manage Registered Citizens</h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl">
              Inspect public citizen accounts and manage access permissions (Suspend / Reactivate).
            </p>
          </div>
          <button
            onClick={fetchCitizens}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#CCFF00] rounded-xl text-xs font-bold transition flex items-center shrink-0"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh List
          </button>
        </div>

        {/* Status Alerts */}
        {actionSuccess && (
          <div className="p-4 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs rounded-xl flex items-center font-bold">
            <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 text-[#CCFF00]" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center font-bold">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0 text-red-400" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Citizens Table Container */}
        <div className="bg-zinc-950/80 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-2xl text-white">
          <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search citizen by name, email, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
              />
            </div>

            <div className="text-xs font-bold text-zinc-400 hidden sm:block">
              Total Citizens: {citizens.length}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CCFF00] border-t-transparent mx-auto"></div>
            </div>
          ) : filteredCitizens.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-xs">
              No citizen accounts match your search filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/80 text-zinc-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Citizen Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Mobile Contact</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredCitizens.map((citizen) => (
                    <tr key={citizen._id} className="hover:bg-zinc-900/50 transition">
                      <td className="p-4">
                        <span className="font-bold text-white text-sm block">{citizen.name}</span>
                      </td>
                      <td className="p-4 font-medium text-zinc-300">{citizen.email}</td>
                      <td className="p-4 text-zinc-400">{citizen.phone || 'N/A'}</td>
                      <td className="p-4 text-zinc-500">
                        {new Date(citizen.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {citizen.isSuspended ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-400 border border-red-500/30">
                            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30">
                            <UserCheck className="w-3.5 h-3.5 mr-1" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {citizen.isSuspended ? (
                          <button
                            onClick={() => handleToggleSuspend(citizen)}
                            disabled={updatingId === citizen._id}
                            className="px-3 py-1.5 bg-[#CCFF00] hover:bg-[#FFFF00] text-black font-black rounded-lg transition text-xs disabled:opacity-50"
                          >
                            {updatingId === citizen._id ? 'Updating...' : 'Reactivate Account'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleSuspend(citizen)}
                            disabled={updatingId === citizen._id}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold rounded-lg transition text-xs disabled:opacity-50"
                          >
                            {updatingId === citizen._id ? 'Updating...' : 'Suspend Account'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ManageCitizens;
