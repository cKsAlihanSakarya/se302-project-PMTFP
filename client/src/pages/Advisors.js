import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstructors, sendAdvisorRequest, getProjects } from '../services/api';

function Advisors() {
  const [instructors, setInstructors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructorsRes = await getInstructors();
        setInstructors(instructorsRes.data);
        if (user?.role === 'student') {
          const projectsRes = await getProjects();
          setProjects(projectsRes.data.filter(p => p.owner_id === user.id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleRequest = async (instructor_id) => {
    if (!selectedProject) {
      setMessage('Please select a project first');
      return;
    }
    try {
      await sendAdvisorRequest({ project_id: selectedProject, instructor_id });
      setMessage('Request sent successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Advisors</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', cursor: 'pointer' }}>← Back</button>
      </div>

      {message && <p style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{message}</p>}

      {user?.role === 'student' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Select your project to send request:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ padding: '8px', width: '300px' }}
          >
            <option value="">Select a project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {instructors.map(instructor => (
          <div key={instructor.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: 0 }}>{instructor.full_name}</h3>
              <span style={{
                background: instructor.is_available ? '#E1F5EE' : '#FCEBEB',
                color: instructor.is_available ? '#085041' : '#791F1F',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                {instructor.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '6px' }}>{instructor.department}</p>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '6px' }}>{instructor.academic_title}</p>
            <p style={{ fontSize: '12px', marginBottom: '10px' }}>
              Expertise: {instructor.areas_of_expertise?.join(', ')}
            </p>
            {user?.role === 'student' && instructor.is_available && (
              <button
                onClick={() => handleRequest(instructor.id)}
                style={{ padding: '6px 14px', background: '#185FA5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Send Request
              </button>
            )}
          </div>
        ))}
        {instructors.length === 0 && <p style={{ color: '#666' }}>No instructors found.</p>}
      </div>
    </div>
  );
}

export default Advisors;