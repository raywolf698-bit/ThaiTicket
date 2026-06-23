import { Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TicketBrowserPage from './pages/tickets/TicketBrowserPage';
import MyTicketsPage from './pages/tickets/MyTicketsPage';
import WalletPage from './pages/wallet/WalletPage';
import TopUpPage from './pages/wallet/TopUpPage';
import ResultsPage from './pages/results/ResultsPage';
import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/tickets" element={<TicketBrowserPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/wallet/topup" element={<TopUpPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<PageLayout />}>
          <Route path="/admin/tickets" element={<AdminTicketsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}