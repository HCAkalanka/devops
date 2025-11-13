import api from './http';

export const createListing = (payload) => api.post('/listings', payload).then(r => r.data);
export const updateListing = (id, patch) => api.patch(`/listings/${id}`, patch).then(r => r.data);
export const getListing = (id) => api.get(`/listings/${id}`).then(r => r.data);
export const listListings = (params) => api.get('/listings', { params }).then(r => r.data);
export const publishListing = (id) => api.post(`/listings/${id}/publish`).then(r => r.data);
