import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Her istekte token otomatik gönderilsin
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.authorization = token;
  }
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getStudentProfile = () => API.get('/auth/profile');
export const updateStudentProfile = (data) => API.put('/auth/profile', data);

// Projects
export const getProjects = () => API.get('/projects');
export const getProject = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post('/projects', data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// Applications
export const applyToProject = (data) => API.post('/applications', data);
export const getProjectApplications = (project_id) => API.get(`/applications/${project_id}`);
export const updateApplication = (id, data) => API.put(`/applications/${id}`, data);

// Advisors
export const getInstructorProfile = () => API.get('/advisors/profile');
export const updateInstructorProfile = (data) => API.put('/advisors/profile', data);
export const getInstructors = () => API.get('/advisors');
export const sendAdvisorRequest = (data) => API.post('/advisors/request', data);
export const getAdvisorRequests = () => API.get('/advisors/requests');
export const updateAdvisorRequest = (id, data) => API.put(`/advisors/requests/${id}`, data);

// Announcements
export const getAnnouncements = () => API.get('/announcements');
export const createAnnouncement = (data) => API.post('/announcements', data);
export const updateAnnouncement = (id, data) => API.put(`/announcements/${id}`, data);
export const deleteAnnouncement = (id) => API.delete(`/announcements/${id}`);