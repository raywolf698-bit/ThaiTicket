import { useState, useEffect, useCallback } from 'react';
import { getBalance, getHistory, topUp as topUpApi } from '../api/wallet.api';

export function useWallet() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [balRes, histRes] = await Promise.all([
        getBalance(),
        getHistory({ limit: 20 }),
      ]);
      const balData = balRes.data;
      const bal = balData?.balance ?? balData ?? 0;
      setBalance(Number(bal));
      setHistory(histRes.data || []);
    } catch (err) {
      setError('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  async function topUp(amount, method) {
    try {
      const res = await topUpApi({ amount, method });
      await fetchWallet();
      return { success: true, balance: res.data.balance };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Top-up failed' };
    }
  }

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  return { balance, history, loading, error, fetchWallet, topUp };
}