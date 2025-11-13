import api from './http';

export const listCities = (params) => api.get('/cities', { params }).then(r => r.data);
