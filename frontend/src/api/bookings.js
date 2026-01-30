import api from './http';

export const checkAvailability = (payload) => api.post('/bookings/check-availability', payload).then(r => r.data);
export const createBooking = (payload) => api.post('/bookings', payload).then(r => r.data);
export const listMyBookings = () => api.get('/bookings').then(r => r.data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`).then(r => r.data);
