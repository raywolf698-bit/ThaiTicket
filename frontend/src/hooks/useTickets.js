import { useState, useEffect } from 'react';
import { getTickets, buyTicket } from '../api/tickets.api';

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState(null);

  async function fetchTickets(params = {}) {
    setLoading(true);
    setError('');
    try {
      const res = await getTickets(params);
      setTickets(res.data);
    } catch (err) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  async function purchaseTicket(ticketId) {
    setBuying(ticketId);
    try {
      await buyTicket(ticketId);
      // Mark as sold locally
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: 'sold' } : t))
      );
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Purchase failed' };
    } finally {
      setBuying(null);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  return { tickets, loading, error, buying, fetchTickets, purchaseTicket };
}