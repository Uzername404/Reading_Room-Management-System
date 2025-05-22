import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies/sessions
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/login/', { username, password });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      // Store the access token for future requests
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
      }
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/token/blacklist/');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Student services
export const studentService = {
  getAll: async (params) => {
    const response = await api.get('/students/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/students/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/students/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/students/${id}/`);
  },
};

// Resource services
export const resourceService = {
  getAll: async (params) => {
    const response = await api.get('/resources/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resources/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/resources/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/resources/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/resources/${id}/`);
  },
};

// Borrow services
export const borrowService = {
  getAll: async (params) => {
    const response = await api.get('/borrows/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/borrows/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/borrows/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/borrows/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/borrows/${id}/`);
  },
};

// Return services
export const returnService = {
  getAll: async (params) => {
    const response = await api.get('/returns/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/returns/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/returns/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/returns/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/returns/${id}/`);
  },
};

// Report services
export const reportService = {
  generate: async (data) => {
    const response = await api.post('/reports/generate/', data);
    return response.data;
  },
};

// User services
export const userService = {
  getAll: async (params) => {
    const response = await api.get('/users/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/users/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/users/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/users/${id}/`);
  },
}; 