import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentProfileById } from '../services/api';

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfileById(id);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">PM</span>
          </div>
          <span className="font-semibold text-gray-800">ProjectMatch</span>
        </div>
        <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">← Back</button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-2xl">
              {profile?.full_name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{profile?.full_name}</h3>
              <p className="text-gray-500 text-sm">{profile?.department}</p>
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Student</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Year</span>
              <span className="text-sm text-gray-800 font-medium">{profile?.year || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm text-gray-800 font-medium">{profile?.email}</span>
            </div>
            {profile?.github_url && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">GitHub</span>
                <a href={`https://${profile.github_url}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">{profile.github_url}</a>
              </div>
            )}
            {profile?.linkedin_url && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">LinkedIn</span>
                <a href={`https://${profile.linkedin_url}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">{profile.linkedin_url}</a>
              </div>
            )}
            <div className="py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 block mb-2">Skills</span>
              <div className="flex flex-wrap gap-1">
                {profile?.skills?.length > 0 ? profile.skills.map(skill => (
                  <span key={skill} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{skill}</span>
                )) : <span className="text-sm text-gray-400">—</span>}
              </div>
            </div>
            {profile?.interests && (
              <div className="py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 block mb-1">Interests</span>
                <p className="text-sm text-gray-800">{profile.interests}</p>
              </div>
            )}
            {profile?.bio && (
              <div className="py-2">
                <span className="text-sm text-gray-500 block mb-1">Bio</span>
                <p className="text-sm text-gray-800">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;