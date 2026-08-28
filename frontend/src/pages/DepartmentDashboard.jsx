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
        <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Field Operations Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{departmentName}</h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
              Inspect assigned civic complaints, update work status, and upload work completion proof photos.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Assigned Tasks</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalAssigned}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Active Field Work</span>
            <div className="text-2xl font-extrabold text-cyan-600 mt-1">{stats.inProgress}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Closed & Completed</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-amber-600" />
              Assigned Field Complaints
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent mx-auto"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No civic complaints assigned to your department currently.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {complaints.map((c) => (
                <div key={c._id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {/* Photo thumbnail - click to view modal */}
                    <div
                      onClick={() => c.evidencePhotos?.[0] && setActiveImagePreview(c.evidencePhotos[0])}
                      className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                      title="Click to view full photo"
                    >
                      {c.evidencePhotos && c.evidencePhotos.length > 0 ? (
                        <img src={c.evidencePhotos[0]} alt="Evidence" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100">
                          Priority: {c.priority}
                        </span>
                        <StatusBadge status={c.status} />
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mt-1">{c.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{c.description}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                        {/* Google Maps link */}
                        <GoogleMapLink location={c.location} />
                        <span>• Reported by: {c.user?.name || 'Citizen'} ({c.user?.phone})</span>
                      </div>

                      {c.completionPhoto && (
                        <button
                          type="button"
                          onClick={() => setActiveImagePreview(c.completionPhoto)}
                          className="mt-2 text-xs text-emerald-700 font-bold underline flex items-center"
                        >
                          View Completion Proof Photo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto justify-end border-t md:border-0 pt-3 md:pt-0 border-slate-100">
                    {c.status !== 'resolved' ? (
                      <>
                        <button
                          onClick={() => {
                            setProgressModal(c);
                            setProgressNotes(c.progressNotes || '');
                            setModalError('');
                          }}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center"
                        >
                          <Wrench className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
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
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center"
                        >
                          <CheckCheck className="w-4 h-4 mr-1.5" />
                          Complete Work & Resolve
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setProgressModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-cyan-600" />
              Update Work Progress
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Issue: <span className="font-bold text-slate-800">{progressModal.title}</span>
            </p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status State
                </label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="assigned">Assigned / Inspection Scheduled</option>
                  <option value="in_progress">Work In Progress (On Site)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Field Update Notes
                </label>
                <textarea
                  rows="3"
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="e.g. Field crew dispatched with asphalt repair truck..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProgressModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Updating...' : 'Save Field Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETE WORK & UPLOAD PHOTO MODAL */}
      {completeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setCompleteModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center">
              <CheckCheck className="w-5 h-5 mr-2 text-emerald-600" />
              Upload Work Completion Proof
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Close complaint <span className="font-bold text-slate-800">"{completeModal.title}"</span> by attaching completion photo evidence.
            </p>

            {modalError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Upload Work Completion Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handlePhotoChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {photoPreview && (
                  <div className="mt-3 border border-emerald-200 rounded-xl overflow-hidden max-h-48">
                    <img src={photoPreview} alt="Work completion preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Final Completion Summary Notes
                </label>
                <textarea
                  rows="2"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Describe repair work executed, materials used..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCompleteModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Uploading...' : 'Close & Resolve Complaint'}
                </button>
              </div>
            </form>
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

export default DepartmentDashboard;
