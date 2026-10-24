import api from './api';

export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const changePassword = (data) => api.put('/auth/change-password', data);

export const getUsers = (search = '') => api.get(`/users?search=${search}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getClubs = (params = {}) => api.get('/clubs', { params });
export const getClubById = (id) => api.get(`/clubs/${id}`);
export const createClub = (data) => api.post('/clubs', data);
export const updateClub = (id, data) => api.put(`/clubs/${id}`, data);
export const deleteClub = (id) => api.delete(`/clubs/${id}`);

export const joinClub = (clubId) => api.post('/memberships', { clubId });
export const getMyMemberships = () => api.get('/memberships/my');
export const getAllMemberships = () => api.get('/memberships');
export const leaveClub = (id) => api.delete(`/memberships/${id}`);

export const getEvents = (params = {}) => api.get('/events', { params });
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

export const registerForEvent = (eventId) => api.post('/registrations', { eventId });
export const getMyRegistrations = () => api.get('/registrations/my');
export const getAllRegistrations = () => api.get('/registrations');
export const cancelRegistration = (id) => api.delete(`/registrations/${id}`);

export const getDashboardStats = () => api.get('/dashboard');
