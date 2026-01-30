import api from './http';

export const listCars = (params) => api.get('/cars', { params }).then(r => r.data);
export const getCar = (id) => api.get(`/cars/${id}`).then(r => r.data);

export default { listCars, getCar };