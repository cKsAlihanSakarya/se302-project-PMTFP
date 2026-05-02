import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnnouncements, createAnnouncement, deleteAnnouncement, getUsers, changeUserRole, deactivateUser, getAdminStats } from '../services/api';

function AdminDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'tubitak' });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('announcements');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const announcementsRes = await getAnnouncements();
        setAnnouncements(announcementsRes.data);
        const usersRes = await getUsers();
        setUsers(usersRes.data);
        const statsRes = await getAdminStats();
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
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

  const handleRoleChange = async (id, role) => {
    try {
      await changeUserRole(id, { role });
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      setMessage('User role updated successfully!');
    } catch (err) {
      setMessage('Failed to update role');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await deactivateUser(id);
      setUsers(users.filter(u => u.id !== id));
      setMessage('User deactivated successfully!');
    } catch (err) {
      setMessage('Failed to deactivate user');
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

  const roleColors = {
    student: 'bg-blue-50 text-blue-700',
    instructor: 'bg-green-50 text-green-700',
    admin: 'bg-red-50 text-red-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">{stats.total_users}</div>
              <div className="text-xs text-gray-500">Total Users</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">{stats.total_projects}</div>
              <div className="text-xs text-gray-500">Total Projects</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">{stats.total_instructors}</div>
              <div className="text-xs text-gray-500">Instructors</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">{stats.total_announcements}</div>
              <div className="text-xs text-gray-500">Announcements</div>
            </div>
          </div>
        )}

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 text-sm rounded-lg transition ${activeTab === 'announcements' ? 'bg-red-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm rounded-lg transition ${activeTab === 'users' ? 'bg-red-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            User Management
          </button>
        </div>

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Create Announcement</h3>
              <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. TÜBİTAK Application Deadline" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Announcement details..." className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 h-24 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                    <option value="tubitak">TÜBİTAK</option>
                    <option value="teknofest">Teknofest</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition">Publish Announcement</button>
              </form>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Announcements ({announcements.length})</h3>
              {announcements.length === 0 && <p className="text-gray-400 text-sm">No announcements yet.</p>}
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[a.category] || 'bg-gray-100 text-gray-600'}`}>{a.category}</span>
                        <h4 className="font-medium text-gray-800 text-sm mt-2 mb-1">{a.title}</h4>
                        <p className="text-gray-500 text-xs">{a.description}</p>
                      </div>
                      <button onClick={() => handleDelete(a.id)} className="ml-3 px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Department</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{u.full_name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.department || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                        {u.id !== user.id && (
                          <button
                            onClick={() => handleDeactivate(u.id)}
                            className="text-xs px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;