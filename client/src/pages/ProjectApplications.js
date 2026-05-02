import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectApplications, updateApplication } from '../services/api';

function ProjectApplications() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const { project_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getProjectApplications(project_id);
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, [project_id]);

  const handleUpdate = async (id, status) => {
    try {
      await updateApplication(id, { status });
      setMessage(`Application ${status} successfully!`);
      setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update application');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">PM</span>
          </div>
          <span className="font-semibold text-gray-800">ProjectMatch</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">← Back</button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Project Applications</h2>
        <p className="text-gray-500 text-sm mb-8">Review and manage applications for your project.</p>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        {applications.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">No applications yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {applications.map(app => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    <button
                      onClick={() => navigate(`/student/${app.applicant_id}`)}
                      className="hover:text-blue-600 hover:underline transition"
                    >
                      {app.full_name}
                    </button>
                  </h4>
                  <p className="text-gray-500 text-sm">{app.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    app.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    app.status === 'accepted' ? 'bg-green-50 text-green-700' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {app.status}
                  </span>
                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(app.id, 'accepted')}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdate(app.id, 'rejected')}
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

export default ProjectApplications;