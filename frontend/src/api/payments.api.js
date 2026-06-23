import client from './client';

export const createTopUp = (amount) => client.post('/payments/top-up', { amount });
export const confirmPayment = (paymentId) => client.post(`/payments/${paymentId}/confirm`);
