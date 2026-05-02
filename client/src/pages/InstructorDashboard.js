import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdvisorRequests, updateAdvisorRequest } from '../services/api';

function InstructorDashboard() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAdvisorRequests();
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await updateAdvisorRequest(id, { status });
      setMessage(`Request ${status} successfully!`);
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update request');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Instructor Dashboard — {user?.full_name}</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
      </div>

      {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}

      <h3>Advisor Requests</h3>
      {requests.length === 0 && <p style={{ color: '#666' }}>No requests yet.</p>}

      {requests.map(request => (
        <div key={request.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 6px 0' }}>{request.project_title}</h4>
              <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px 0' }}>Student: {request.student_name}</p>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Type: {request.project_type}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                background: request.status === 'pending' ? '#FAEEDA' : request.status === 'accepted' ? '#E1F5EE' : '#FCEBEB',
                color: request.status === 'pending' ? '#633806' : request.status === 'accepted' ? '#085041' : '#791F1F'
              }}>
                {request.status}
              </span>
              {request.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdate(request.id, 'accepted')}
                    style={{ padding: '6px 14px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdate(request.id, 'rejected')}
                    style={{ padding: '6px 14px', background: '#D85A30', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InstructorDashboard;