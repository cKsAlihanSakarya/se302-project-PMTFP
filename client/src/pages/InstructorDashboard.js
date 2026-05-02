import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdvisorRequests, updateAdvisorRequest } from '../services/api';

function InstructorDashboard() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAdvisorRequests();
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Instructor Dashboard</h2>
        <p className="text-gray-500 text-sm mb-8">Manage your advisor requests.</p>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <h3 className="font-semibold text-gray-700 mb-4">Advisor Requests</h3>

        {requests.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">No advisor requests yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {requests.map(request => (
            <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{request.project_title}</h4>
                  <p className="text-gray-500 text-sm mb-1">Student: {request.student_name}</p>
                  <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">{request.project_type}</span>
                </div>
                <div className="flex items-center gap-3">
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
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdate(request.id, 'rejected')}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
  );
}

export default InstructorDashboard;