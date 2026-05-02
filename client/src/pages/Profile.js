import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Profile</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', cursor: 'pointer' }}>← Back</button>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#0C447C' }}>
            {user?.full_name?.charAt(0)}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{user?.full_name}</h3>
            <p style={{ color: '#666', margin: 0, fontSize: '13px' }}>{user?.role}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 0', color: '#666', width: '40%' }}>Full Name</td>
              <td style={{ padding: '10px 0' }}>{user?.full_name}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 0', color: '#666' }}>Email</td>
              <td style={{ padding: '10px 0' }}>{user?.email}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 0', color: '#666' }}>Role</td>
              <td style={{ padding: '10px 0' }}>{user?.role}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 0', color: '#666' }}>ID</td>
              <td style={{ padding: '10px 0' }}>{user?.id}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Profile;