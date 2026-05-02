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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
      </div>

      {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Create Announcement</h3>
          <form onSubmit={handleCreate} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', height: '80px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="tubitak">TÜBİTAK</option>
                <option value="teknofest">Teknofest</option>
                <option value="general">General</option>
              </select>
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '8px', background: '#D85A30', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Create Announcement
            </button>
          </form>
        </div>

        <div>
          <h3>Announcements</h3>
          {announcements.length === 0 && <p style={{ color: '#666' }}>No announcements yet.</p>}
          {announcements.map(a => (
            <div key={a.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>{a.title}</h4>
                  <p style={{ color: '#666', fontSize: '12px', margin: '0 0 4px 0' }}>{a.category}</p>
                  <p style={{ fontSize: '13px', margin: 0 }}>{a.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{ padding: '4px 10px', background: '#FCEBEB', color: '#791F1F', border: '1px solid #F09595', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;