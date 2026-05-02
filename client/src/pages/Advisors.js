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

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Advisors</h2>
        <p className="text-gray-500 text-sm mb-6">Find an academic advisor for your project.</p>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        {user?.role === 'student' && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select your project to send advisor request:</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
            >
              <option value="">Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {instructors.map(instructor => (
            <div key={instructor.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {instructor.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{instructor.full_name}</h3>
                    <p className="text-gray-500 text-xs">{instructor.department}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${instructor.is_available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {instructor.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{instructor.academic_title}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {instructor.areas_of_expertise?.map(area => (
                  <span key={area} className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">{area}</span>
                ))}
              </div>
              {user?.role === 'student' && instructor.is_available && (
                <button
                  onClick={() => handleRequest(instructor.id)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                >
                  Send Request
                </button>
              )}
            </div>
          ))}
          {instructors.length === 0 && (
            <p className="text-gray-400 text-sm col-span-2">No instructors found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Advisors;