import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdvisorRequests, updateAdvisorRequest, getInstructorProfile, updateInstructorProfile } from '../services/api';

function InstructorDashboard() {
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    academic_title: '',
    areas_of_expertise: '',
    research_interests: '',
    previous_project_types: '',
    is_available: true
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsRes = await getAdvisorRequests();
        setRequests(requestsRes.data);
        const profileRes = await getInstructorProfile();
        setProfile(profileRes.data);
        setFormData({
          academic_title: profileRes.data.academic_title || '',
          areas_of_expertise: profileRes.data.areas_of_expertise?.join(', ') || '',
          research_interests: profileRes.data.research_interests || '',
          previous_project_types: profileRes.data.previous_project_types?.join(', ') || '',
          is_available: profileRes.data.is_available ?? true
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await updateAdvisorRequest(id, { status });
      setMessage(`Request ${status} successfully!`);
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update request');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        areas_of_expertise: formData.areas_of_expertise.split(',').map(s => s.trim()),
        previous_project_types: formData.previous_project_types.split(',').map(s => s.trim())
      };
      await updateInstructorProfile(data);
      setMessage('Profile updated successfully!');
      setEditing(false);
      const profileRes = await getInstructorProfile();
      setProfile(profileRes.data);
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">PM</span>
          </div>
          <span className="font-semibold text-gray-800">ProjectMatch</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.full_name}</span>
          <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">Instructor</span>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Logout</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Instructor Dashboard</h2>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Profile */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">My Profile</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {!editing ? (
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Name</span>
                  <span className="text-sm text-gray-800 font-medium">{user?.full_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Department</span>
                  <span className="text-sm text-gray-800 font-medium">{user?.department}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Title</span>
                  <span className="text-sm text-gray-800 font-medium">{profile?.academic_title || '—'}</span>
                </div>
                <div className="py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 block mb-2">Expertise</span>
                  <div className="flex flex-wrap gap-1">
                    {profile?.areas_of_expertise?.map(area => (
                      <span key={area} className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">{area}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Available for advising</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${profile?.is_available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {profile?.is_available ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Title</label>
                  <input
                    type="text"
                    value={formData.academic_title}
                    onChange={e => setFormData({ ...formData, academic_title: e.target.value })}
                    placeholder="e.g. Associate Professor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Areas of Expertise <span className="text-gray-400 font-normal">(comma separated)</span></label>
                  <input
                    type="text"
                    value={formData.areas_of_expertise}
                    onChange={e => setFormData({ ...formData, areas_of_expertise: e.target.value })}
                    placeholder="Machine Learning, NLP"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests</label>
                  <input
                    type="text"
                    value={formData.research_interests}
                    onChange={e => setFormData({ ...formData, research_interests: e.target.value })}
                    placeholder="AI, Computer Vision"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Project Types <span className="text-gray-400 font-normal">(comma separated)</span></label>
                  <input
                    type="text"
                    value={formData.previous_project_types}
                    onChange={e => setFormData({ ...formData, previous_project_types: e.target.value })}
                    placeholder="tubitak, teknofest"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={formData.is_available}
                    onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-4 h-4 text-green-600"
                  />
                  <label htmlFor="is_available" className="text-sm font-medium text-gray-700">Available for advising</label>
                </div>
                <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                  Save Profile
                </button>
              </form>
            )}
          </div>

          {/* Requests */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Advisor Requests</h3>
            {requests.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-400 text-sm">No advisor requests yet.</p>
              </div>
            )}
            <div className="space-y-3">
              {requests.map(request => (
                <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{request.project_title}</h4>
                      <p className="text-gray-500 text-xs mb-1">Student: {request.student_name}</p>
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">{request.project_type}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        request.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        request.status === 'accepted' ? 'bg-green-50 text-green-700' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {request.status}
                      </span>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(request.id, 'accepted')}
                            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdate(request.id, 'rejected')}
                            className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;