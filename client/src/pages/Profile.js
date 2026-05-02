import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, updateStudentProfile } from '../services/api';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    skills: '',
    interests: '',
    github_url: '',
    linkedin_url: '',
    bio: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfile();
        setProfile(res.data);
        setFormData({
          year: res.data.year || '',
          skills: res.data.skills?.join(', ') || '',
          interests: res.data.interests || '',
          github_url: res.data.github_url || '',
          linkedin_url: res.data.linkedin_url || '',
          bio: res.data.bio || ''
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      };
      await updateStudentProfile(data);
      setMessage('Profile updated successfully!');
      setEditing(false);
      const res = await getStudentProfile();
      setProfile(res.data);
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  const roleColors = {
    student: 'bg-blue-50 text-blue-700',
    instructor: 'bg-green-50 text-green-700',
    admin: 'bg-red-50 text-red-600'
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

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <p className="text-gray-500 text-sm">Your account information.</p>
          </div>
          {user?.role === 'student' && (
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-2xl">
              {user?.full_name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user?.full_name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${roleColors[user?.role]}`}>
                {user?.role}
              </span>
            </div>
          </div>

          {!editing ? (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm text-gray-800 font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Department</span>
                <span className="text-sm text-gray-800 font-medium">{user?.department || '—'}</span>
              </div>
              {user?.role === 'student' && (
                <>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Year</span>
                    <span className="text-sm text-gray-800 font-medium">{profile?.year || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">GitHub</span>
                    <span className="text-sm text-blue-600">{profile?.github_url || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">LinkedIn</span>
                    <span className="text-sm text-blue-600">{profile?.linkedin_url || '—'}</span>
                  </div>
                  <div className="py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500 block mb-2">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {profile?.skills?.length > 0 ? profile.skills.map(skill => (
                        <span key={skill} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{skill}</span>
                      )) : <span className="text-sm text-gray-400">—</span>}
                    </div>
                  </div>
                  <div className="py-2">
                    <span className="text-sm text-gray-500 block mb-1">Bio</span>
                    <p className="text-sm text-gray-800">{profile?.bio || '—'}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="Web Development, Machine Learning" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input type="text" name="github_url" value={formData.github_url} onChange={handleChange} placeholder="github.com/username" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input type="text" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="linkedin.com/in/username" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none" />
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Save Profile
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;