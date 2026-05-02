import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, getAnnouncements, getMyProjectsApplications } from '../services/api';

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsRes = await getProjects();
                const announcementsRes = await getAnnouncements();
                setProjects(projectsRes.data.slice(0, 3));
                setAnnouncements(announcementsRes.data.slice(0, 3));
                if (user?.role === 'student') {
                    const applicationsRes = await getMyProjectsApplications();
                    setMyApplications(applicationsRes.data);
                }
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
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">PM</span>
                    </div>
                    <span className="font-semibold text-gray-800">ProjectMatch</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/projects')} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Projects</button>
                    <button onClick={() => navigate('/advisors')} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Advisors</button>
                    <button onClick={() => navigate('/profile')} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Profile</button>
                    <button onClick={() => navigate('/create-project')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">+ New Project</button>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Logout</button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {user?.full_name} 👋</h2>
                <p className="text-gray-500 text-sm mb-8">Here's what's happening on ProjectMatch.</p>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Recent Projects</h3>
                            <button onClick={() => navigate('/projects')} className="text-sm text-blue-600 hover:underline">View all</button>
                        </div>
                        {projects.length === 0 && <p className="text-gray-400 text-sm">No projects yet.</p>}
                        {projects.map(project => (
                            <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{project.project_type}</span>
                                    <span className="text-xs text-gray-400">{project.current_members}/{project.team_size} members</span>
                                </div>
                                <h4 className="font-medium text-gray-800 text-sm mb-1">{project.title}</h4>
                                <p className="text-gray-500 text-xs mb-3">{project.description?.slice(0, 80)}...</p>
                                <div className="flex gap-2">
                                    {user?.role === 'student' && project.owner_id !== user.id && (
                                        <button
                                            onClick={() => navigate('/projects')}
                                            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Apply
                                        </button>
                                    )}
                                    {user?.role === 'student' && project.owner_id === user.id && (
                                        <button
                                            onClick={() => navigate(`/applications/${project.id}`)}
                                            className="px-3 py-1.5 text-xs border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            View Applications
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Announcements</h3>
                        </div>
                        {announcements.length === 0 && <p className="text-gray-400 text-sm">No announcements yet.</p>}
                        {announcements.map(a => (
                            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full">{a.category}</span>
                                </div>
                                <h4 className="font-medium text-gray-800 text-sm mb-1">{a.title}</h4>
                                <p className="text-gray-500 text-xs">{a.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {user?.role === 'student' && myApplications.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-700 mb-4">Applications to My Projects</h3>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-gray-600 font-medium">Project</th>
                                        <th className="text-left px-4 py-3 text-gray-600 font-medium">Applicant</th>
                                        <th className="text-left px-4 py-3 text-gray-600 font-medium">Department</th>
                                        <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                                        <th className="text-left px-4 py-3 text-gray-600 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myApplications.map(app => (
                                        <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800 text-sm">{app.project_title}</div>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    app.project_type === 'tubitak' ? 'bg-teal-50 text-teal-700' :
                                                    app.project_type === 'teknofest' ? 'bg-purple-50 text-purple-700' :
                                                    'bg-amber-50 text-amber-700'
                                                }`}>{app.project_type}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-800">{app.applicant_name}</td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">{app.applicant_department}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    app.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                                    app.status === 'accepted' ? 'bg-green-50 text-green-700' :
                                                    'bg-red-50 text-red-600'
                                                }`}>{app.status}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => navigate(`/applications/${app.project_id}`)}
                                                    className="text-xs px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;