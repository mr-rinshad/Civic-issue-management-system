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
  Send,
  Image as ImageIcon,
} from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' | 'departments'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [verifyModalComplaint, setVerifyModalComplaint] = useState(null);
  const [assignModalComplaint, setAssignModalComplaint] = useState(null);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [detailModalComplaint, setDetailModalComplaint] = useState(null);
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  // Form states for Verify (Accept/Reject)
  const [verifyAction, setVerifyAction] = useState('accept'); // 'accept' | 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Form states for Assigning Dept
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [assignPriority, setAssignPriority] = useState('Medium');

  // Form states for Creating New Dept
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

  // Handle Accept or Reject
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

  // Handle Assign to Dept
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

  // Handle Create Dept
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
        <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Councillor Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Municipal Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
              Inspect reported issues, verify ground reality, reject invalid entries, and dispatch authorized municipal departments.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('departments');
                setShowAddDeptModal(true);
              }}
              className="px-4 py-2.5 bg-white text-purple-900 hover:bg-purple-50 font-bold rounded-xl shadow-md transition flex items-center text-xs sm:text-sm"
            >
              <PlusCircle className="w-4 h-4 mr-1.5 text-purple-600" />
              Add New Dept
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Reported</span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{stats.totalComplaints}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-600 uppercase">Pending Audit</span>
              <div className="text-xl font-extrabold text-amber-600 mt-1">{stats.pendingVerification}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-blue-600 uppercase">Accepted</span>
              <div className="text-xl font-extrabold text-blue-600 mt-1">{stats.accepted}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-purple-600 uppercase">Assigned</span>
              <div className="text-xl font-extrabold text-purple-600 mt-1">{stats.assigned}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-cyan-600 uppercase">In Progress</span>
              <div className="text-xl font-extrabold text-cyan-600 mt-1">{stats.inProgress}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Resolved</span>
              <div className="text-xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`py-3 px-5 font-bold text-sm border-b-2 transition ${
              activeTab === 'complaints'
                ? 'border-purple-600 text-purple-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All Civic Complaints ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-3 px-5 font-bold text-sm border-b-2 transition ${
              activeTab === 'departments'
                ? 'border-purple-600 text-purple-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Municipal Departments ({departments.length})
          </button>
        </div>

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Search & Filter Header */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500"
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

            {/* Complaints Table */}
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mx-auto"></div>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No civic complaints match the current filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-4">Evidence</th>
                      <th className="p-4">Issue Details</th>
                      <th className="p-4">Reported By</th>
                      <th className="p-4">Google Maps Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Department</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredComplaints.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <div
                            onClick={() => c.evidencePhotos?.[0] && setActiveImagePreview(c.evidencePhotos[0])}
                            className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                            title="Click to expand photo"
                          >
                            {c.evidencePhotos && c.evidencePhotos.length > 0 ? (
                              <img src={c.evidencePhotos[0]} alt="Evidence" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            onClick={() => setDetailModalComplaint(c)}
                            className="font-bold text-slate-900 text-sm block hover:text-purple-600 cursor-pointer"
                          >
                            {c.title}
                          </span>
                          <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold border border-purple-100">
                            {c.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-800 block">{c.user?.name || 'Citizen'}</span>
                          <span className="text-[11px] text-slate-400">{c.user?.phone || c.user?.email}</span>
                        </td>
                        <td className="p-4">
                          {/* Google Maps Clickable Link */}
                          <GoogleMapLink location={c.location} />
                        </td>
                        <td className="p-4">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="p-4">
                          {c.assignedDepartmentName ? (
                            <span className="font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                              {c.assignedDepartmentName}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not Assigned</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {/* Physical Verification Action Button */}
                          {c.status === 'pending_verification' && (
                            <button
                              onClick={() => {
                                setVerifyModalComplaint(c);
                                setVerifyAction('accept');
                                setModalError('');
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition"
                            >
                              Verify Issue
                            </button>
                          )}

                          {/* Assign to Department Action Button */}
                          {c.status === 'accepted' && (
                            <button
                              onClick={() => {
                                setAssignModalComplaint(c);
                                setModalError('');
                              }}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-xs transition"
                            >
                              Assign Dept
                            </button>
                          )}

                          <button
                            onClick={() => setDetailModalComplaint(c)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Registered Municipal Departments</h3>
                <p className="text-xs text-slate-500">
                  Government departments authorized to resolve assigned civic complaints.
                </p>
              </div>
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-4 py-2 bg-purple-700 text-white font-bold text-xs rounded-xl hover:bg-purple-800 shadow-xs transition"
              >
                + Add Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((d) => (
                <div key={d._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold shrink-0">
                    {d.code}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{d.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">{d.description}</p>
                    <p className="text-xs text-purple-700 font-semibold mt-2">
                      Official Email: {d.officialUser?.email || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VERIFY COMPLAINT MODAL */}
      {verifyModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setVerifyModalComplaint(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Physical Audit & Verification
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Issue: <span className="font-bold text-slate-800">{verifyModalComplaint.title}</span>
            </p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Audit Decision *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVerifyAction('accept')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center transition ${
                      verifyAction === 'accept'
                        ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600" />
                    Accept Issue
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifyAction('reject')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center transition ${
                      verifyAction === 'reject'
                        ? 'bg-red-50 border-red-500 text-red-800 ring-2 ring-red-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-4 h-4 mr-1.5 text-red-600" />
                    Reject Issue
                  </button>
                </div>
              </div>

              {verifyAction === 'reject' && (
                <div>
                  <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                    Rejection Reason (Required) *
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Duplicate report, private property issue, or insufficient evidence..."
                    className="w-full p-2.5 bg-red-50/50 border border-red-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
                  ></textarea>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Verification Audit Notes
                </label>
                <input
                  type="text"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="e.g. Physically inspected by Councillor ward team on site."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVerifyModalComplaint(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md ${
                    verifyAction === 'accept' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : `Confirm ${verifyAction === 'accept' ? 'Acceptance' : 'Rejection'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN DEPARTMENT MODAL */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setAssignModalComplaint(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-purple-600" />
              Assign to Municipal Department
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Forward complaint <span className="font-bold text-slate-800">"{assignModalComplaint.title}"</span> to responsible team.
            </p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Department *
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work Priority
                </label>
                <select
                  value={assignPriority}
                  onChange={(e) => setAssignPriority(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent / Emergency</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Assigning...' : 'Dispatch to Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW DEPARTMENT MODAL */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddDeptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-purple-600" />
              Add Department Account
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create a new municipal department and login credentials for their official.
            </p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateDept} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Health & Sanitation Dept"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Department Code *
                </label>
                <input
                  type="text"
                  required
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="e.g. HLS"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Official Email (For Department Login) *
                </label>
                <input
                  type="email"
                  required
                  value={deptEmail}
                  onChange={(e) => setDeptEmail(e.target.value)}
                  placeholder="health@civic.com"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Official Password *
                </label>
                <input
                  type="password"
                  required
                  value={deptPassword}
                  onChange={(e) => setDeptPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  placeholder="Duties and responsibilities..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL WITH IMAGE EXPAND & GOOGLE MAPS */}
      {detailModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalComplaint(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <StatusBadge status={detailModalComplaint.status} />
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">{detailModalComplaint.title}</h3>
            <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {detailModalComplaint.description}
            </p>

            <div className="my-3">
              <span className="text-xs font-bold text-slate-700 mr-2">Location:</span>
              <GoogleMapLink location={detailModalComplaint.location} />
            </div>

            {/* Evidence Photos */}
            {detailModalComplaint.evidencePhotos && detailModalComplaint.evidencePhotos.length > 0 && (
              <div className="my-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Evidence Photos (Click to Enlarge):</h4>
                <div className="flex gap-2 overflow-x-auto">
                  {detailModalComplaint.evidencePhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Evidence"
                      onClick={() => setActiveImagePreview(photo)}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-80 transition"
                    />
                  ))}
                </div>
              </div>
            )}

            <Timeline complaint={detailModalComplaint} />
          </div>
        </div>
      )}

      {/* Full Resolution Image Lightbox Modal */}
      <ImageModal
        imageUrl={activeImagePreview}
        onClose={() => setActiveImagePreview(null)}
      />
    </SidebarLayout>
  );
};

export default AdminDashboard;
