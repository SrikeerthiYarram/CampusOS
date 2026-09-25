import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for global 401 handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        // localStorage.removeItem('campusos_token');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const academicAPI = {
  getCourses: () => API.get('/academics/courses'),
  getCourseById: (id) => API.get(`/academics/courses/${id}`),
  createCourse: (data) => API.post('/academics/courses', data),
  checkInAttendance: (data) => API.post('/academics/attendance/checkin', data),
};

export const eventAPI = {
  getEvents: (params) => API.get('/events', { params }),
  getEventById: (id) => API.get(`/events/${id}`),
  createEvent: (data) => API.post('/events', data),
  rsvp: (id) => API.post(`/events/${id}/rsvp`),
};

export const hackathonAPI = {
  getHackathons: () => API.get('/hackathons'),
  createHackathon: (data) => API.post('/hackathons', data),
  joinTeam: (id, data) => API.post(`/hackathons/${id}/team`, data),
};

export const internshipAPI = {
  getInternships: (params) => API.get('/internships', { params }),
  createInternship: (data) => API.post('/internships', data),
  apply: (id, data) => API.post(`/internships/${id}/apply`, data),
};

export const clubAPI = {
  getClubs: (params) => API.get('/clubs', { params }),
  createClub: (data) => API.post('/clubs', data),
  toggleJoin: (id) => API.post(`/clubs/${id}/join`),
};

export const announcementAPI = {
  getAnnouncements: (params) => API.get('/announcements', { params }),
  createAnnouncement: (data) => API.post('/announcements', data),
  deleteAnnouncement: (id) => API.delete(`/announcements/${id}`),
};

export const resourceAPI = {
  getResources: (params) => API.get('/resources', { params }),
  createResource: (data) => API.post('/resources', data),
  download: (id) => API.post(`/resources/${id}/download`),
};

export const notificationAPI = {
  getNotifications: () => API.get('/notifications'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all'),
};

export const adminAPI = {
  getMetrics: () => API.get('/admin/metrics'),
  getUsers: () => API.get('/admin/users'),
  updateUserRole: (id, data) => API.put(`/admin/users/${id}/role`, data),
};

export const healthAPI = {
  checkHealth: () => API.get('/health'),
};

export default API;
