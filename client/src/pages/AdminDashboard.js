import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../services/api';

function AdminDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'tubitak' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await getAnnouncements();
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createAnnouncement(formData);
      setAnnouncements([res.data, ...announcements]);
      setFormData({ title: '', description: '', category: 'tubitak' });
      setMessage('Announcement created successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create announcement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
      setMessage('Announcement deleted successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const categoryColors = {
    tubitak: 'bg-teal-50 text-teal-700',
    teknofest: 'bg-purple-50 text-purple-700',
    general: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">PM</span>
          </div>
          <span className="font-semibold text-gray-800">ProjectMatch</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.full_name}</span>
          <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full">Admin</span>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Logout</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h2>
        <p className="text-gray-500 text-sm mb-8">Manage announcements and platform settings.</p>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Create Announcement */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Create Announcement</h3>
            <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. TÜBİTAK Application Deadline"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Announcement details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="tubitak">TÜBİTAK</option>
                  <option value="teknofest">Teknofest</option>
                  <option value="general">General</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
              >
                Publish Announcement
              </button>
            </form>
          </div>

          {/* Announcements List */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Announcements ({announcements.length})</h3>
            {announcements.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-400 text-sm">No announcements yet.</p>
              </div>
            )}
            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[a.category] || 'bg-gray-100 text-gray-600'}`}>
                          {a.category}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1">{a.title}</h4>
                      <p className="text-gray-500 text-xs">{a.description}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="ml-3 px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
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

export default AdminDashboard;