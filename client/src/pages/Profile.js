import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const roleColors = {
    student: 'bg-blue-50 text-blue-700',
    instructor: 'bg-green-50 text-green-700',
    admin: 'bg-red-50 text-red-600'
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
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Profile</h2>
        <p className="text-gray-500 text-sm mb-8">Your account information.</p>

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

          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500 w-40">Full Name</td>
                <td className="py-3 text-gray-800 font-medium">{user?.full_name}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">Email</td>
                <td className="py-3 text-gray-800 font-medium">{user?.email}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">Role</td>
                <td className="py-3 text-gray-800 font-medium capitalize">{user?.role}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">User ID</td>
                <td className="py-3 text-gray-800 font-medium">#{user?.id}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Profile;