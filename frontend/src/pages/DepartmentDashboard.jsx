import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SidebarLayout from '../components/SidebarLayout';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import GoogleMapLink from '../components/GoogleMapLink';
import ImageModal from '../components/ImageModal';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Wrench,
  CheckCheck,
  Upload,
  Clock,
  AlertCircle,
  MapPin,
  X,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

const DepartmentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [progressModal, setProgressModal] = useState(null);
  const [completeModal, setCompleteModal] = useState(null);
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  // Progress Form
  const [progressNotes, setProgressNotes] = useState('');
  const [progressStatus, setProgressStatus] = useState('in_progress');

  // Complete Form
  const [completionPhoto, setCompletionPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');

  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get('/complaints/department/assigned');
      if (res.data.success) {
        setComplaints(res.data.complaints);
        setDepartmentName(res.data.department || user?.departmentName || 'Department');
      }
    } catch (error) {
      console.error('Error fetching department complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const handleUpdateProgressSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    try {
      setIsSubmitting(true);
      const res = await API.put(`/complaints/${progressModal._id}/progress`, {
        progressNotes,
        status: progressStatus,
      });

      if (res.data.success) {
        setProgressModal(null);
        setProgressNotes('');
        fetchAssignedComplaints();
      }
    } catch (error) {
      setModalError(error.response?.data?.message || 'Error updating progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompletionPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!completionPhoto) {
      setModalError('Work completion photo proof is required to close a civic complaint.');
      return;
    }

    const formData = new FormData();
    formData.append('completionPhoto', completionPhoto);
    formData.append('progressNotes', completionNotes || 'Work completed successfully on field.');

    try {
      setIsSubmitting(true);
      const res = await API.put(`/complaints/${completeModal._id}/complete`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setCompleteModal(null);
        setCompletionPhoto(null);
        setPhotoPreview('');
        setCompletionNotes('');
        fetchAssignedComplaints();
      }
    } catch (error) {
      setModalError(error.response?.data?.message || 'Error closing complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    totalAssigned: complaints.length,
    inProgress: complaints.filter((c) => c.status === 'in_progress' || c.status === 'assigned').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  };

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Department Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-3xl p-6 border border-[#CCFF00]/30 shadow-[0_0_30px_rgba(204,255,0,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#CCFF00] block mb-1">
              Field Operations Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">{departmentName}</h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl">
              Inspect assigned civic complaints, update work status, and upload work completion proof photos.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800 backdrop-blur-md">
            <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">Total Assigned Tasks</span>
            <div className="text-2xl font-black text-white mt-1">{stats.totalAssigned}</div>
          </div>

          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-[#FFFF00]/30 backdrop-blur-md">
            <span className="text-[11px] font-extrabold text-[#FFFF00] uppercase tracking-wider">Active Field Work</span>
            <div className="text-2xl font-black text-[#FFFF00] mt-1">{stats.inProgress}</div>
          </div>

          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-[#CCFF00]/30 backdrop-blur-md">
            <span className="text-[11px] font-extrabold text-[#CCFF00] uppercase tracking-wider">Closed & Completed</span>
            <div className="text-2xl font-black text-[#CCFF00] mt-1">{stats.resolved}</div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-zinc-950/80 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-2xl">
          <div className="p-5 border-b border-zinc-900">
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-[#CCFF00]" />
              Assigned Field Complaints
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CCFF00] border-t-transparent mx-auto"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-xs font-bold">
              No civic complaints assigned to your department currently.
            </div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {complaints.map((c) => (
                <div key={c._id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div
                      onClick={() => c.evidencePhotos?.[0] && setActiveImagePreview(c.evidencePhotos[0])}
                      className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                    >
                      {c.evidencePhotos && c.evidencePhotos.length > 0 ? (
                        <img src={c.evidencePhotos[0]} alt="Evidence" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-zinc-600" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-extrabold text-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-0.5 rounded border border-[#CCFF00]/30">
                          Priority: {c.priority}
                        </span>
                        <StatusBadge status={c.status} />
                      </div>

                      <h3 className="font-bold text-white text-base mt-1">{c.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{c.description}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 mt-2">
                        <GoogleMapLink location={c.location} />
                        <span>• Reported by: {c.user?.name || 'Citizen'} ({c.user?.phone})</span>
                      </div>

                      {c.completionPhoto && (
                        <button
                          type="button"
                          onClick={() => setActiveImagePreview(c.completionPhoto)}
                          className="mt-2 text-xs text-[#CCFF00] font-bold underline flex items-center"
                        >
                          View Work Completion Photo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto justify-end border-t md:border-0 pt-3 md:pt-0 border-zinc-900">
                    {c.status !== 'resolved' ? (
                      <>
                        <button
                          onClick={() => {
                            setProgressModal(c);
                            setProgressNotes(c.progressNotes || '');
                            setModalError('');
                          }}
                          className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-800 transition flex items-center"
                        >
                          <Wrench className="w-3.5 h-3.5 mr-1.5 text-[#CCFF00]" />
                          Update Progress
                        </button>

                        <button
                          onClick={() => {
                            setCompleteModal(c);
                            setCompletionPhoto(null);
                            setPhotoPreview('');
                            setCompletionNotes('');
                            setModalError('');
                          }}
                          className="px-4 py-2 bg-[#CCFF00] hover:bg-[#FFFF00] text-black font-extrabold text-xs rounded-xl shadow-md transition flex items-center uppercase tracking-wider"
                        >
                          <CheckCheck className="w-4 h-4 mr-1.5" />
                          Complete Work & Resolve
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-extrabold text-[#CCFF00] bg-[#CCFF00]/10 px-3 py-1.5 rounded-xl border border-[#CCFF00]/30 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-[#CCFF00]" />
                        Completed & Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* UPDATE PROGRESS MODAL */}
      {progressModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl max-w-md w-full p-6 border border-[#CCFF00]/30 shadow-2xl relative text-white">
            <button
              onClick={() => setProgressModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black uppercase text-white mb-1">Update Field Progress</h3>
            <p className="text-xs text-zinc-400 mb-4">Issue: {progressModal.title}</p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Status State
                </label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                >
                  <option value="assigned">Assigned / Inspection Scheduled</option>
                  <option value="in_progress">Work In Progress (On Site)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Field Update Notes
                </label>
                <textarea
                  rows="3"
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="e.g. Field crew dispatched..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setProgressModal(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-black text-black bg-[#CCFF00] hover:bg-[#FFFF00] rounded-xl"
                >
                  {isSubmitting ? 'Updating...' : 'Save Field Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETE WORK MODAL */}
      {completeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl max-w-lg w-full p-6 border border-[#CCFF00]/30 shadow-2xl relative text-white">
            <button
              onClick={() => setCompleteModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black uppercase text-white mb-1">Upload Work Completion Proof</h3>
            <p className="text-xs text-zinc-400 mb-4">Close complaint "{completeModal.title}".</p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Upload Completion Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handlePhotoChange}
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#CCFF00] file:text-black hover:file:bg-[#FFFF00]"
                />
                {photoPreview && (
                  <div className="mt-3 border border-zinc-800 rounded-xl overflow-hidden max-h-48">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Final Completion Summary Notes
                </label>
                <textarea
                  rows="2"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Describe repair work..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setCompleteModal(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-black text-black bg-[#CCFF00] hover:bg-[#FFFF00] rounded-xl"
                >
                  {isSubmitting ? 'Uploading...' : 'Close & Resolve'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImageModal imageUrl={activeImagePreview} onClose={() => setActiveImagePreview(null)} />
    </SidebarLayout>
  );
};

export default DepartmentDashboard;
