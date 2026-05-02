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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">PM</span>
          </div>
          <span className="font-semibold text-gray-800">ProjectMatch</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">← Back</button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Project</h2>
        <p className="text-gray-500 text-sm mb-8">Post a new project and find your team.</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Smart Irrigation System"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="course">Course Project</option>
              <option value="tubitak">TÜBİTAK Student Project</option>
              <option value="teknofest">Teknofest Student Project</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
            <input
              type="text"
              name="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              placeholder="React, Node.js, Python"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
            <input
              type="number"
              name="team_size"
              value={formData.team_size}
              onChange={handleChange}
              placeholder="e.g. 4"
              min="1"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roles Needed <span className="text-gray-400 font-normal">(comma separated)</span></label>
            <input
              type="text"
              name="roles_needed"
              value={formData.roles_needed}
              onChange={handleChange}
              placeholder="Frontend, Backend, Designer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="advisor_needed"
              id="advisor_needed"
              checked={formData.advisor_needed}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="advisor_needed" className="text-sm font-medium text-gray-700">Advisor Needed</label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;