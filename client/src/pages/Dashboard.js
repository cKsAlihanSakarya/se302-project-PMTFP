import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, getAnnouncements } from '../services/api';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRes = await getProjects();
        const announcementsRes = await getAnnouncements();
        setProjects(projectsRes.data.slice(0, 3));
        setAnnouncements(announcementsRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {user?.full_name}</h2>
        <div>
          <button onClick={() => navigate('/projects')} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>Projects</button>
          <button onClick={() => navigate('/advisors')} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>Advisors</button>
          <button onClick={() => navigate('/create-project')} style={{ marginRight: '10px', padding: '8px 16px', background: '#185FA5', color: 'white', border: 'none', cursor: 'pointer' }}>+ New Project</button>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Recent Projects</h3>
          {projects.map(project => (
            <div key={project.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
              <h4>{project.title}</h4>
              <p style={{ color: '#666', fontSize: '13px' }}>{project.project_type} · {project.team_size} members</p>
              <button onClick={() => navigate('/projects')} style={{ marginTop: '8px', padding: '4px 12px', cursor: 'pointer' }}>View</button>
            </div>
          ))}
        </div>

        <div>
          <h3>Announcements</h3>
          {announcements.length === 0 && <p style={{ color: '#666' }}>No announcements yet.</p>}
          {announcements.map(a => (
            <div key={a.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
              <h4>{a.title}</h4>
              <p style={{ color: '#666', fontSize: '13px' }}>{a.category}</p>
              <p style={{ fontSize: '13px' }}>{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;