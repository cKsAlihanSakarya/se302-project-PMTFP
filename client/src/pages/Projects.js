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

    const typeColors = {
        course: 'bg-amber-50 text-amber-700',
        tubitak: 'bg-teal-50 text-teal-700',
        teknofest: 'bg-purple-50 text-purple-700'
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
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                        <p className="text-gray-500 text-sm">Browse and apply to open projects.</p>
                    </div>
                    {user?.role === 'student' && (
                        <button onClick={() => navigate('/create-project')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">+ New Project</button>
                    )}
                </div>

                {message && (
                    <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {message}
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {['all', 'course', 'tubitak', 'teknofest'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1.5 text-sm rounded-full border transition ${filter === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {filtered.map(project => (
                        <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-xs px-2 py-1 rounded-full ${typeColors[project.project_type]}`}>
                                    {project.project_type}
                                </span>
                                <span className="text-xs text-gray-400">{project.current_members}/{project.team_size} members</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">{project.title}</h3>
                            <p className="text-gray-500 text-xs mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {project.required_skills?.map(skill => (
                                    <span key={skill} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{skill}</span>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mb-4">Roles: {project.roles_needed?.join(', ')}</p>
                            <div className="flex gap-2">
                                {user?.role === 'student' && project.owner_id !== user.id && (
                                    <button
                                        onClick={() => handleApply(project.id)}
                                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Apply
                                    </button>
                                )}
                                {user?.role === 'student' && project.owner_id === user.id && (
                                    <button
                                        onClick={() => navigate(`/applications/${project.id}`)}
                                        className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                    >
                                        View Applications
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Projects;