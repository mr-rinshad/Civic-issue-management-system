import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SidebarLayout from '../components/SidebarLayout';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import GoogleMapLink from '../components/GoogleMapLink';
import ImageModal from '../components/ImageModal';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Building2,
  UserCheck,
  PlusCircle,
  FileText,
  AlertCircle,
  Clock,
  Wrench,
  Search,
  Filter,
  X,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('complaints');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [verifyModalComplaint, setVerifyModalComplaint] = useState(null);
  const [assignModalComplaint, setAssignModalComplaint] = useState(null);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [detailModalComplaint, setDetailModalComplaint] = useState(null);
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  // Verify form
  const [verifyAction, setVerifyAction] = useState('accept');
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Assign form
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [assignPriority, setAssignPriority] = useState('Medium');

  // Create Dept form
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptEmail, setDeptEmail] = useState('');
  const [deptPassword, setDeptPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [compRes, deptRes, statsRes] = await Promise.all([
        API.get('/complaints/admin/all'),
        API.get('/departments'),
        API.get('/stats/admin'),
      ]);

      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (deptRes.data.success) setDepartments(deptRes.data.departments);
      if (statsRes.data.success) setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (verifyAction === 'reject' && !rejectionReason.trim()) {
      setModalError('Rejection reason is required when rejecting a complaint.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await API.put(`/complaints/${verifyModalComplaint._id}/verify`, {
        action: verifyAction,
        rejectionReason,
        verificationNotes,
      });

      if (res.data.success) {
        setVerifyModalComplaint(null);
        setRejectionReason('');
        setVerificationNotes('');
        fetchData();
      }
    } catch (error) {
      setModalError(error.response?.data?.message || 'Error processing verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!selectedDeptId) {
      setModalError('Please select a department.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await API.put(`/complaints/${assignModalComplaint._id}/assign`, {
        departmentId: selectedDeptId,
        priority: assignPriority,
      });

      if (res.data.success) {
        setAssignModalComplaint(null);
        setSelectedDeptId('');
        fetchData();
      }
    } catch (error) {
      setModalError(error.response?.data?.message || 'Error assigning department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!deptName || !deptCode || !deptEmail || !deptPassword) {
      setModalError('Please fill in department name, code, official email, and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await API.post('/departments', {
        name: deptName,
        code: deptCode,
        description: deptDesc,
        officialEmail: deptEmail,
        officialPassword: deptPassword,
      });

      if (res.data.success) {
        setShowAddDeptModal(false);
        setDeptName('');
        setDeptCode('');
        setDeptDesc('');
        setDeptEmail('');
        setDeptPassword('');
        fetchData();
      }
    } catch (error) {
      setModalError(error.response?.data?.message || 'Error creating department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = filterStatus === 'all' ? true : c.status === filterStatus;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location?.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-3xl p-6 border border-[#CCFF00]/30 shadow-[0_0_30px_rgba(204,255,0,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#CCFF00] block mb-1">
              Councillor Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl">
              Inspect reported issues, verify ground reality, reject invalid entries, and dispatch authorized departments.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('departments');
                setShowAddDeptModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#CCFF00] to-[#DFFF00] hover:from-[#FFFF00] hover:to-[#CCFF00] text-black font-extrabold rounded-xl shadow-md transition flex items-center text-xs uppercase"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Department
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 backdrop-blur-md">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase">Total</span>
              <div className="text-xl font-black text-white mt-1">{stats.totalComplaints}</div>
            </div>

            <div className="bg-zinc-950/80 p-4 rounded-xl border border-[#FFFF00]/30 backdrop-blur-md">
              <span className="text-[10px] font-extrabold text-[#FFFF00] uppercase">Pending Audit</span>
              <div className="text-xl font-black text-[#FFFF00] mt-1">{stats.pendingVerification}</div>
            </div>

            <div className="bg-zinc-950/80 p-4 rounded-xl border border-[#DFFF00]/30 backdrop-blur-md">
              <span className="text-[10px] font-extrabold text-[#DFFF00] uppercase">Accepted</span>
              <div className="text-xl font-black text-[#DFFF00] mt-1">{stats.accepted}</div>
            </div>

            <div className="bg-zinc-950/80 p-4 rounded-xl border border-[#CCFF00]/30 backdrop-blur-md">
              <span className="text-[10px] font-extrabold text-[#CCFF00] uppercase">Assigned</span>
              <div className="text-xl font-black text-[#CCFF00] mt-1">{stats.assigned}</div>
            </div>

            <div className="bg-zinc-950/80 p-4 rounded-xl border border-[#FFFF00]/30 backdrop-blur-md">
              <span className="text-[10px] font-extrabold text-[#FFFF00] uppercase">In Progress</span>
              <div className="text-xl font-black text-[#FFFF00] mt-1">{stats.inProgress}</div>
            </div>

            <div className="bg-zinc-950/80 p-4 rounded-xl border border-[#CCFF00]/40 backdrop-blur-md">
              <span className="text-[10px] font-extrabold text-[#CCFF00] uppercase">Resolved</span>
              <div className="text-xl font-black text-[#CCFF00] mt-1">{stats.resolved}</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-900">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`py-3 px-5 font-black text-xs uppercase tracking-wider border-b-2 transition ${
              activeTab === 'complaints'
                ? 'border-[#CCFF00] text-[#CCFF00]'
                : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            All Civic Complaints ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-3 px-5 font-black text-xs uppercase tracking-wider border-b-2 transition ${
              activeTab === 'departments'
                ? 'border-[#CCFF00] text-[#CCFF00]'
                : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            Departments ({departments.length})
          </button>
        </div>

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="bg-zinc-950/80 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-2xl">
            {/* Search Header */}
            <div className="p-4 border-b border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
                <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="py-1.5 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-[#CCFF00]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_verification">Pending Physical Audit</option>
                  <option value="accepted">Accepted & Unassigned</option>
                  <option value="assigned">Assigned to Department</option>
                  <option value="in_progress">Work In Progress</option>
                  <option value="resolved">Resolved & Closed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-12 text-center text-zinc-500">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CCFF00] border-t-transparent mx-auto"></div>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-xs">
                No civic complaints match the selected filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900/80 text-zinc-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Evidence</th>
                      <th className="p-4">Issue Details</th>
                      <th className="p-4">Reported By</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Completion Proof</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {filteredComplaints.map((c) => (
                      <tr key={c._id} className="hover:bg-zinc-900/50 transition">
                        <td className="p-4">
                          <div
                            onClick={() => c.evidencePhotos?.[0] && setActiveImagePreview(c.evidencePhotos[0])}
                            className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                          >
                            {c.evidencePhotos && c.evidencePhotos.length > 0 ? (
                              <img src={c.evidencePhotos[0]} alt="Evidence" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            onClick={() => setDetailModalComplaint(c)}
                            className="font-bold text-white text-sm block hover:text-[#CCFF00] cursor-pointer"
                          >
                            {c.title}
                          </span>
                          <span className="text-[10px] font-black text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]/30">
                            {c.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-white block">{c.user?.name || 'Citizen'}</span>
                          <span className="text-[10px] text-zinc-500">{c.user?.phone || c.user?.email}</span>
                        </td>
                        <td className="p-4">
                          <GoogleMapLink location={c.location} />
                        </td>
                        <td className="p-4">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="p-4">
                          {c.completionPhoto ? (
                            <button
                              onClick={() => setActiveImagePreview(c.completionPhoto)}
                              className="px-2.5 py-1 bg-[#CCFF00]/20 text-[#CCFF00] font-extrabold border border-[#CCFF00]/40 rounded-lg hover:bg-[#CCFF00]/30 transition text-[11px] flex items-center"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              View Work Photo
                            </button>
                          ) : (
                            <span className="text-zinc-600 italic">Pending Work</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {c.status === 'pending_verification' && (
                            <button
                              onClick={() => {
                                setVerifyModalComplaint(c);
                                setVerifyAction('accept');
                                setModalError('');
                              }}
                              className="px-3 py-1.5 bg-[#CCFF00] hover:bg-[#FFFF00] text-black font-black rounded-lg transition"
                            >
                              Verify Issue
                            </button>
                          )}

                          {c.status === 'accepted' && (
                            <button
                              onClick={() => {
                                setAssignModalComplaint(c);
                                setModalError('');
                              }}
                              className="px-3 py-1.5 bg-[#DFFF00] hover:bg-[#FFFF00] text-black font-black rounded-lg transition"
                            >
                              Assign Dept
                            </button>
                          )}

                          <button
                            onClick={() => setDetailModalComplaint(c)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-lg border border-zinc-800"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* DEPARTMENTS TAB */}
        {activeTab === 'departments' && (
          <div className="bg-zinc-950/80 rounded-3xl border border-zinc-800 p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-white">Registered Departments</h3>
                <p className="text-xs text-zinc-400">Authorized municipal departments for resolving assigned tasks.</p>
              </div>
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-4 py-2 bg-[#CCFF00] text-black font-black text-xs rounded-xl hover:bg-[#FFFF00] transition"
              >
                + Add Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((d) => (
                <div key={d._id} className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00] font-black shrink-0">
                    {d.code}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{d.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{d.description}</p>
                    <p className="text-xs text-[#CCFF00] font-semibold mt-2">
                      Official Email: {d.officialUser?.email || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VERIFY MODAL */}
      {verifyModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl max-w-lg w-full p-6 border border-[#CCFF00]/30 shadow-2xl relative text-white">
            <button
              onClick={() => setVerifyModalComplaint(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1 uppercase">Physical Verification Audit</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Issue: <span className="font-bold text-white">{verifyModalComplaint.title}</span>
            </p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-2">
                  Audit Decision *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVerifyAction('accept')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center transition ${
                      verifyAction === 'accept'
                        ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Accept Issue
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifyAction('reject')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center transition ${
                      verifyAction === 'reject'
                        ? 'bg-red-500/20 text-red-400 border-red-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject Issue
                  </button>
                </div>
              </div>

              {verifyAction === 'reject' && (
                <div>
                  <label className="block text-[11px] font-extrabold text-red-400 uppercase tracking-wider mb-1">
                    Rejection Reason *
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Duplicate report..."
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-red-500"
                  ></textarea>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Audit Notes
                </label>
                <input
                  type="text"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="e.g. Physically inspected..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setVerifyModalComplaint(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-black text-black bg-[#CCFF00] hover:bg-[#FFFF00] rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN DEPARTMENT MODAL */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl max-w-lg w-full p-6 border border-[#CCFF00]/30 shadow-2xl relative text-white">
            <button
              onClick={() => setAssignModalComplaint(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1 uppercase">Assign Department</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Assign complaint <span className="font-bold text-white">"{assignModalComplaint.title}"</span>.
            </p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Select Department *
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                >
                  <option value="">-- Choose Municipal Department --</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Work Priority
                </label>
                <select
                  value={assignPriority}
                  onChange={(e) => setAssignPriority(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent / Emergency</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-black text-black bg-[#CCFF00] hover:bg-[#FFFF00] rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Assigning...' : 'Dispatch Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DEPARTMENT MODAL */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl max-w-md w-full p-6 border border-[#CCFF00]/30 shadow-2xl relative text-white">
            <button
              onClick={() => setShowAddDeptModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1 uppercase">Add Department Account</h3>
            <p className="text-xs text-zinc-400 mb-4">Create department and official login credentials.</p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateDept} className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="Health & Sanitation Dept"
                  className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase mb-1">
                  Department Code *
                </label>
                <input
                  type="text"
                  required
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="HLS"
                  className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={deptEmail}
                  onChange={(e) => setDeptEmail(e.target.value)}
                  placeholder="health@civic.com"
                  className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase mb-1">
                  Official Password *
                </label>
                <input
                  type="password"
                  required
                  value={deptPassword}
                  onChange={(e) => setDeptPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-black text-black bg-[#CCFF00] hover:bg-[#FFFF00] rounded-xl"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl max-w-xl w-full p-6 border border-[#CCFF00]/30 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
            <button
              onClick={() => setDetailModalComplaint(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <StatusBadge status={detailModalComplaint.status} />
            <h3 className="text-xl font-black text-white mt-2">{detailModalComplaint.title}</h3>
            <p className="text-xs text-zinc-300 mt-2 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
              {detailModalComplaint.description}
            </p>

            <div className="my-3 text-xs text-zinc-400">
              <span className="font-bold text-white mr-2">Location:</span>
              <GoogleMapLink location={detailModalComplaint.location} />
            </div>

            {detailModalComplaint.completionPhoto && (
              <div className="my-4 p-4 bg-zinc-900 border border-[#CCFF00]/30 rounded-2xl">
                <h4 className="text-xs font-extrabold text-[#CCFF00] uppercase mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-[#CCFF00]" />
                  Department Work Completion Photo Proof
                </h4>
                <img
                  src={detailModalComplaint.completionPhoto}
                  alt="Work Completion"
                  onClick={() => setActiveImagePreview(detailModalComplaint.completionPhoto)}
                  className="w-full max-h-56 object-cover rounded-xl border border-zinc-800 cursor-pointer hover:opacity-90 transition"
                />
              </div>
            )}

            <Timeline complaint={detailModalComplaint} />
          </div>
        </div>
      )}

      <ImageModal imageUrl={activeImagePreview} onClose={() => setActiveImagePreview(null)} />
    </SidebarLayout>
  );
};

export default AdminDashboard;
