import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SidebarLayout from '../components/SidebarLayout';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import GoogleMapLink from '../components/GoogleMapLink';
import ImageModal from '../components/ImageModal';
import {
  PlusCircle,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  X,
  FileText,
  Navigation,
} from 'lucide-react';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  // New Complaint Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Potholes');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get('/complaints/my');
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setFormError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        if (!address) {
          setAddress(`GPS: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
        }
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setFormError('Unable to retrieve your location. Please type manually.');
      }
    );
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !description || !address) {
      setFormError('Please fill in title, description, and location address.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('address', address);
    if (latitude) formData.append('latitude', latitude);
    if (longitude) formData.append('longitude', longitude);
    formData.append('priority', priority);

    selectedFiles.forEach((file) => {
      formData.append('evidencePhotos', file);
    });

    try {
      setIsSubmitting(true);
      const res = await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setShowReportModal(false);
        resetForm();
        fetchMyComplaints();
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Error submitting complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Potholes');
    setDescription('');
    setAddress('');
    setLatitude('');
    setLongitude('');
    setPriority('Medium');
    setSelectedFiles([]);
    setPreviewUrls([]);
    setFormError('');
  };

  const filteredComplaints = complaints.filter((item) => {
    if (filter === 'pending') return item.status === 'pending_verification';
    if (filter === 'in_progress') return ['accepted', 'assigned', 'in_progress'].includes(item.status);
    if (filter === 'resolved') return item.status === 'resolved';
    if (filter === 'rejected') return item.status === 'rejected';
    return true;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending_verification').length,
    inProgress: complaints.filter((c) => ['accepted', 'assigned', 'in_progress'].includes(c.status)).length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  };

  return (
    <SidebarLayout onOpenReportModal={() => setShowReportModal(true)}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-3xl p-6 border border-[#CCFF00]/30 shadow-[0_0_30px_rgba(204,255,0,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#CCFF00] block mb-1">
              Public Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Citizen Portal</h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl">
              Report infrastructure hazards, garbage accumulation, or street faults in real-time and track resolution progress.
            </p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-[#CCFF00] to-[#DFFF00] hover:from-[#FFFF00] hover:to-[#CCFF00] text-black font-extrabold rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)] transition flex items-center shrink-0 text-xs uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Report New Issue
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800 backdrop-blur-md">
            <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">Total Filed</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">{stats.total}</div>
          </div>

          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-[#FFFF00]/30 backdrop-blur-md">
            <span className="text-[11px] font-extrabold text-[#FFFF00] uppercase tracking-wider">Pending Audit</span>
            <div className="text-2xl sm:text-3xl font-black text-[#FFFF00] mt-1">{stats.pending}</div>
          </div>

          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-[#DFFF00]/30 backdrop-blur-md">
            <span className="text-[11px] font-extrabold text-[#DFFF00] uppercase tracking-wider">In Progress</span>
            <div className="text-2xl sm:text-3xl font-black text-[#DFFF00] mt-1">{stats.inProgress}</div>
          </div>

          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-[#CCFF00]/30 backdrop-blur-md">
            <span className="text-[11px] font-extrabold text-[#CCFF00] uppercase tracking-wider">Resolved</span>
            <div className="text-2xl sm:text-3xl font-black text-[#CCFF00] mt-1">{stats.resolved}</div>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="bg-zinc-950/80 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-2xl">
          <div className="p-5 border-b border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#CCFF00]" />
              My Reported Issues
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${filter === 'all' ? 'bg-[#CCFF00] text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition ${filter === 'pending' ? 'bg-[#FFFF00] text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg transition ${filter === 'in_progress' ? 'bg-[#DFFF00] text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-3 py-1.5 rounded-lg transition ${filter === 'resolved' ? 'bg-[#CCFF00] text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Complaints List */}
          {loading ? (
            <div className="p-12 text-center text-zinc-500">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CCFF00] border-t-transparent mx-auto"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <AlertTriangle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="font-bold text-zinc-400">No complaints match this view filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="p-5 hover:bg-zinc-900/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      onClick={() =>
                        complaint.evidencePhotos?.[0] && setActiveImagePreview(complaint.evidencePhotos[0])
                      }
                      className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                    >
                      {complaint.evidencePhotos && complaint.evidencePhotos.length > 0 ? (
                        <img
                          src={complaint.evidencePhotos[0]}
                          alt={complaint.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-zinc-600" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-extrabold text-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-0.5 rounded border border-[#CCFF00]/30">
                          {complaint.category}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3
                        onClick={() => setSelectedComplaint(complaint)}
                        className="font-bold text-white text-base mt-1 hover:text-[#CCFF00] transition cursor-pointer"
                      >
                        {complaint.title}
                      </h3>
                      <div className="mt-1">
                        <GoogleMapLink location={complaint.location} className="text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-3 md:pt-0 border-zinc-900">
                    <StatusBadge status={complaint.status} />
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="text-xs font-extrabold text-black bg-[#CCFF00] hover:bg-[#FFFF00] px-3.5 py-1.5 rounded-xl transition shadow-[0_0_10px_rgba(204,255,0,0.2)]"
                    >
                      Track Progress
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REPORT NEW ISSUE MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 rounded-3xl max-w-xl w-full p-6 border border-[#CCFF00]/30 shadow-2xl relative my-8 text-white">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black uppercase text-white mb-1 flex items-center">
              <PlusCircle className="w-6 h-6 mr-2 text-[#CCFF00]" />
              Report a Civic Issue
            </h2>
            <p className="text-xs text-zinc-400 mb-5">
              Provide issue details, evidence photos, and location coordinates for ground verification.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                  >
                    <option value="Potholes">Potholes & Broken Roads</option>
                    <option value="Garbage Accumulation">Garbage & Waste Accumulation</option>
                    <option value="Broken Streetlights">Broken / Faulty Streetlights</option>
                    <option value="Water Leaks">Water Leaks & Pipe Burst</option>
                    <option value="Damaged Infrastructure">Damaged Public Infrastructure</option>
                    <option value="Other">Other Municipal Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent / Safety Hazard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole near main gate"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue size, landmark, or hazard..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                ></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    Location Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="text-xs text-[#CCFF00] font-bold flex items-center hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5 mr-1" />
                    {isLocating ? 'Locating...' : 'Get GPS Location'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, landmark..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                  Upload Evidence Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#CCFF00] file:text-black hover:file:bg-[#FFFF00]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-black text-black bg-[#CCFF00] hover:bg-[#FFFF00] rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRACKER & DETAIL MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 rounded-3xl max-w-2xl w-full p-6 border border-[#CCFF00]/30 shadow-2xl relative my-8 text-white">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-zinc-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[11px] font-extrabold text-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-0.5 rounded border border-[#CCFF00]/30">
                {selectedComplaint.category}
              </span>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <h2 className="text-xl font-extrabold text-white mb-2">{selectedComplaint.title}</h2>
            <p className="text-xs text-zinc-300 mb-4 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
              {selectedComplaint.description}
            </p>

            <div className="my-3 text-xs text-zinc-400">
              <span className="font-bold text-white mr-2">Location:</span>
              <GoogleMapLink location={selectedComplaint.location} />
            </div>

            {selectedComplaint.evidencePhotos && selectedComplaint.evidencePhotos.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-extrabold text-[#CCFF00] uppercase mb-2">Evidence Photos (Click to Enlarge):</h4>
                <div className="flex gap-2 overflow-x-auto">
                  {selectedComplaint.evidencePhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Evidence"
                      onClick={() => setActiveImagePreview(photo)}
                      className="w-20 h-20 object-cover rounded-xl border border-zinc-800 cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              </div>
            )}

            <Timeline complaint={selectedComplaint} />
          </div>
        </div>
      )}

      <ImageModal imageUrl={activeImagePreview} onClose={() => setActiveImagePreview(null)} />
    </SidebarLayout>
  );
};

export default UserDashboard;
