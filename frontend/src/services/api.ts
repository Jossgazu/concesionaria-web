import axios from 'axios';
import { create } from 'zustand';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
});

const authStore = create<{ token: string | null }>(() => ({ token: null }));

export const setAuthToken = (token: string | null) => authStore.setState({ token });

api.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  uploadAvatar: (formData: FormData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const vehicleService = {
  getAll: (params?: any) => api.get('/vehicles', { params }),
  getFeatured: () => api.get('/vehicles/featured'),
  getById: (id: string) => api.get(`/vehicles/${id}`),
  create: (data: any) => api.post('/vehicles', data),
  update: (id: string, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
  getMyVehicles: () => api.get('/vehicles/my'),
  getDashboardStats: () => api.get('/dashboard/stats'),
  getSellerVehicles: (params?: any) => api.get('/dashboard/vehicles', { params }),
  uploadImage: (id: string, formData: FormData) =>
    api.post(`/vehicles/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const valuationService = {
  create: (data: any) => api.post('/valuations', data),
  getAll: () => api.get('/valuations'),
  getById: (id: string) => api.get(`/valuations/${id}`),
};

export const favoriteService = {
  add: (vehicleId: string) => api.post(`/favorites/${vehicleId}`),
  remove: (vehicleId: string) => api.delete(`/favorites/${vehicleId}`),
  getAll: () => api.get('/favorites'),
};

export const messageService = {
  getConversations: () => api.get('/messages'),
  getWithUser: (userId: string) => api.get(`/messages/${userId}`),
  getMessages: (conversationId: string) => api.get(`/messages/conversations/${conversationId}`),
  send: (receiverId: string, content: string, vehicleId?: string) =>
    api.post('/messages', { receiver_id: receiverId, content, vehicle_id: vehicleId }),
  markAsRead: (id: string) => api.put(`/messages/${id}/read`),
};

export const ratingService = {
  create: (data: any) => api.post('/ratings', data),
  getUserRatings: (userId: string, params?: any) => api.get(`/ratings/user/${userId}`, { params }),
  getUserSummary: (userId: string) => api.get(`/ratings/user/${userId}/summary`),
  getUserRatingSummary: (userId: string) => api.get(`/ratings/user/${userId}/summary`),
};

export default api;
