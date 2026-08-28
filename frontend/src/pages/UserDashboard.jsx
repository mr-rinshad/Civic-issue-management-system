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
  Upload,
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
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Citizen Civic Dashboard</h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
              Report infrastructure hazards, garbage accumulation, or street faults in real-time and track resolution progress transparently.
            </p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 font-bold rounded-xl shadow-md transition flex items-center shrink-0 text-sm"
          >
            <PlusCircle className="w-5 h-5 mr-2 text-blue-600" />
            Report New Issue
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Filed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Physical Audit</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{stats.pending}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Action In Progress</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 mt-1">{stats.inProgress}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resolved Issues</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</div>
          </div>
        </div>

        {/* Complaints Section Header & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              My Reported Civic Issues
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${filter === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition ${filter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'hover:text-slate-900'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg transition ${filter === 'in_progress' ? 'bg-white text-cyan-700 shadow-xs' : 'hover:text-slate-900'}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-3 py-1.5 rounded-lg transition ${filter === 'resolved' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'}`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Complaints List */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No complaints found in this view.</p>
              <p className="text-xs text-slate-400 mt-1">Report a new issue using the button above.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="p-5 hover:bg-slate-50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    {/* Thumbnail Image - Click opens Image Modal */}
                    <div
                      onClick={() =>
                        complaint.evidencePhotos?.[0] && setActiveImagePreview(complaint.evidencePhotos[0])
                      }
                      className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                      title="Click to view full photo"
                    >
                      {complaint.evidencePhotos && complaint.evidencePhotos.length > 0 ? (
                        <img
                          src={complaint.evidencePhotos[0]}
                          alt={complaint.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                          {complaint.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3
                        onClick={() => setSelectedComplaint(complaint)}
                        className="font-bold text-slate-900 text-base mt-1 hover:text-blue-600 transition cursor-pointer"
                      >
                        {complaint.title}
                      </h3>
                      {/* Location with Google Maps link */}
                      <div className="mt-1">
                        <GoogleMapLink location={complaint.location} className="text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-3 md:pt-0 border-slate-100">
                    <StatusBadge status={complaint.status} />
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-1 flex items-center">
              <PlusCircle className="w-6 h-6 mr-2 text-blue-600" />
              Report a Civic Issue
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Fill in the issue details, attach evidence photos, and share location for physical inspection.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-4">
              {/* Category & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent / Safety Hazard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole near Central School main gate"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue size, landmark, or potential hazard..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Location with Geolocation Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Location / Landmark Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center"
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
                  placeholder="Street name, landmark, ward number..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
                {latitude && longitude && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    ✓ GPS Coordinates Captured: Lat {latitude.toFixed(4)}, Lng {longitude.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Photo Upload with Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Upload Evidence Photos (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {previewUrls.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto py-1">
                    {previewUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0 cursor-pointer hover:opacity-80"
                        onClick={() => setActiveImagePreview(url)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Civic Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLAINT DETAIL & TRACKER MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                {selectedComplaint.category}
              </span>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-2">
              {selectedComplaint.title}
            </h2>

            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {selectedComplaint.description}
            </p>

            <div className="text-xs text-slate-600 space-y-2 mb-6">
              <div className="flex items-center">
                <span className="font-bold text-slate-700 mr-2">Location (Google Maps):</span>
                <GoogleMapLink location={selectedComplaint.location} />
              </div>
              {selectedComplaint.assignedDepartmentName && (
                <p className="flex items-center text-purple-700">
                  <Wrench className="w-4 h-4 mr-1 text-purple-500" />
                  <span className="font-bold mr-1">Assigned Department:</span> {selectedComplaint.assignedDepartmentName}
                </p>
              )}
            </div>

            {/* Evidence Photos - Click to enlarge in ImageModal */}
            {selectedComplaint.evidencePhotos && selectedComplaint.evidencePhotos.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Evidence Photos (Click to Enlarge):</h4>
                <div className="flex gap-2 overflow-x-auto">
                  {selectedComplaint.evidencePhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Evidence"
                      onClick={() => setActiveImagePreview(photo)}
                      className="w-24 h-24 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-80 transition"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Progress */}
            <Timeline complaint={selectedComplaint} />

            {/* Completion Photo Proof if Resolved */}
            {selectedComplaint.completionPhoto && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h4 className="text-xs font-bold text-emerald-800 uppercase mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                  Work Completion Evidence Photo (Click to Enlarge)
                </h4>
                <img
                  src={selectedComplaint.completionPhoto}
                  alt="Work Completion"
                  onClick={() => setActiveImagePreview(selectedComplaint.completionPhoto)}
                  className="w-full max-h-56 object-cover rounded-xl border border-emerald-300 mt-1 cursor-pointer hover:opacity-90 transition"
                />
                {selectedComplaint.progressNotes && (
                  <p className="text-xs text-emerald-900 mt-2 font-medium">
                    Department Closing Note: "{selectedComplaint.progressNotes}"
                  </p>
                )}
              </div>
            )}
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

export default UserDashboard;
