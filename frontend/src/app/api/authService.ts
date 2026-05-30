import api from './client';

export const authService = {
  login(username: string, password: string) {
    return api.post('/auth/login', { username, password });
  },

  register(username: string, email: string, password: string, fullName: string) {
    return api.post('/auth/register', { username, email, password, fullName });
  },

  getProfile() {
    return api.get('/auth/me');
  },
};
