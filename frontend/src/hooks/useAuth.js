import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import * as authApi from '../api/auth.api';

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  async function register(data) {
    const res = await authApi.register(data);
    setAuth(res.data.user, res.data.token);
    navigate('/tickets');
  }

  async function login(data) {
    const res = await authApi.login(data);
    setAuth(res.data.user, res.data.token);
    navigate('/tickets');
  }

  function logout() {
    clearAuth();
    navigate('/login');
  }

  return { register, login, logout };
}