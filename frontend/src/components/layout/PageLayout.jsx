import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function PageLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}