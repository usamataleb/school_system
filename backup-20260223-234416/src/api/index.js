import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
};

export const studentsAPI = {
  list:   ()     => api.get('/students/'),
  get:    (id)   => api.get(`/students/${id}/`),
  create: (data) => api.post('/students/', data),
  update: (id, data) => api.put(`/students/${id}/`, data),
  delete: (id)   => api.delete(`/students/${id}/`),
};

export const coursesAPI = {
  list:   ()     => api.get('/courses/'),
  create: (data) => api.post('/courses/', data),
  update: (id, data) => api.put(`/courses/${id}/`, data),
  delete: (id)   => api.delete(`/courses/${id}/`),
};

export const enrollmentsAPI = {
  list:   ()     => api.get('/enrollments/'),
  create: (data) => api.post('/enrollments/', data),
};

export const resultsAPI = {
  list:   ()     => api.get('/results/'),
  create: (data) => api.post('/results/', data),
  update: (id, data) => api.put(`/results/${id}/`, data),
};

export default api;
