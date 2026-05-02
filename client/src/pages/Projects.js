import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, applyToProject } from '../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const handleApply = async (project_id) => {
    try {
      await applyToProject({ project_id });
      setMessage('Applied successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Application failed');
    }
  };

  const filtered = filter === 'all' ? projects : projects.filter(p => p.project_type === filter);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Projects</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', cursor: 'pointer' }}>← Back</button>
      </div>

      {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {['all', 'course', 'tubitak', 'teknofest'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '6px 14px',
              cursor: 'pointer',
              background: filter === type ? '#185FA5' : 'white',
              color: filter === type ? 'white' : 'black',
              border: '1px solid #ddd',
              borderRadius: '20px'
            }}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {filtered.map(project => (
          <div key={project.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ background: '#E6F1FB', color: '#0C447C', padding: '2px 8px', borderRadius: '20px', fontSize: '12px' }}>
                {project.project_type}
              </span>
              <span style={{ fontSize: '12px', color: '#666' }}>{project.team_size} members</span>
            </div>
            <h3 style={{ marginBottom: '6px' }}>{project.title}</h3>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>{project.description}</p>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              Skills: {project.required_skills?.join(', ')}
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
              Roles: {project.roles_needed?.join(', ')}
            </p>
            {user?.role === 'student' && project.owner_id !== user.id && (
              <button
                onClick={() => handleApply(project.id)}
                style={{ padding: '6px 14px', background: '#185FA5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;