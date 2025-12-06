import axios from 'axios';

const API_BASE_URL = 'http://api.houseofresha.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Banner APIs
export const bannerAPI = {
  getAll: () => api.get('/banner'),
  create: (formData) => {
    return axios.post(`${API_BASE_URL}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, formData) => {
    return axios.patch(`${API_BASE_URL}/banner/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/banner/${id}`),
};

export default api;