import client from './client';

export const getBalance = () => client.get('/wallet/balance', { params: { _t: Date.now() } });
export const getHistory = (params) => client.get('/wallet/history', { params });
export const withdraw = (data) => client.post('/wallet/withdraw', data);
export const topUp = (data) => client.post('/wallet/topup-test', data);
export const requestWithdraw = (data) => client.post('/wallet/withdraw-request', data);
export const getWithdrawals = () => client.get('/wallet/withdrawals');