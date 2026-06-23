import client from './client';

export const uploadTicket = (formData) => client.post('/admin/tickets', formData);
export const deleteTicket = (id) => client.delete(`/admin/tickets/${id}`);
export const getAllTickets = () => client.get('/tickets', { params: { limit: 500 } });