import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/api';

function CreateProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: 'course',
    required_skills: '',
    team_size: '',
    roles_needed: '',
    advisor_needed: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        required_skills: formData.required_skills.split(',').map(s => s.trim()),
        roles_needed: formData.roles_needed.split(',').map(r => r.trim()),
        team_size: parseInt(formData.team_size)
      };
      await createProject(data);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Create Project</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', cursor: 'pointer' }}>← Back</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Project Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', height: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Project Type</label>
          <select
            name="project_type"
            value={formData.project_type}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="course">Course Project</option>
            <option value="tubitak">TÜBİTAK Student Project</option>
            <option value="teknofest">Teknofest Student Project</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Required Skills (comma separated)</label>
          <input
            type="text"
            name="required_skills"
            placeholder="React, Node.js, Python"
            value={formData.required_skills}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Team Size</label>
          <input
            type="number"
            name="team_size"
            value={formData.team_size}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            min="1"
            max="10"
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Roles Needed (comma separated)</label>
          <input
            type="text"
            name="roles_needed"
            placeholder="Frontend, Backend, Designer"
            value={formData.roles_needed}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            <input
              type="checkbox"
              name="advisor_needed"
              checked={formData.advisor_needed}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Advisor Needed
          </label>
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', background: '#185FA5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Create Project
        </button>
      </form>
    </div>
  );
}

export default CreateProject;