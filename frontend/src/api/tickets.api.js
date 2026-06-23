import client from './client';

export const getTickets = (params) => client.get('/tickets', { params });
export const buyTicket = (id) => client.post(`/tickets/${id}/buy`);
export const getMyTickets = () => client.get('/tickets/my');