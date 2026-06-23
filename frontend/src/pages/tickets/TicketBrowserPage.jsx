import { useState } from 'react';
import { useTickets } from '../../hooks/useTickets';
import TicketGrid from '../../components/tickets/TicketGrid';
import { colors, gradients } from '../../styles/theme';
import LineContact from '../../components/common/LineContact';
const TEXT = {
  en: {
    title: 'Browse Tickets',
    subtitle: 'Find your lucky number',
    search: 'Search by number...',
    drawDate: 'Draw Date',
    all: 'All',
    available: 'Available',
    sold: 'Sold',
    filter: 'Filter',
    results: 'tickets found',
    buySuccess: '🎉 Ticket purchased successfully!',
    buyFail: 'Purchase failed. Please try again.',
    allDates: 'All Dates',
  },
  th: {
    title: 'ซื้อสลาก',
    subtitle: 'ค้นหาเลขนำโชคของคุณ',
    search: 'ค้นหาด้วยหมายเลข...',
    drawDate: 'วันออกรางวัล',
    all: 'ทั้งหมด',
    available: 'ว่างอยู่',
    sold: 'ขายแล้ว',
    filter: 'กรอง',
    results: 'ใบที่พบ',
    buySuccess: '🎉 ซื้อสลากสำเร็จ!',
    buyFail: 'ไม่สามารถซื้อได้ กรุณาลองใหม่',
    allDates: 'ทุกวัน',
  },
};

export default function TicketBrowserPage() {
  const { tickets, loading, buying, fetchTickets, purchaseTicket } = useTickets();
  const [lang, setLang] = useState('en');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [toast, setToast] = useState(null);
  const t = TEXT[lang];

  // Get unique draw dates
  const drawDates = [...new Set(tickets.map((t) => t.draw_date))].sort();

  // Filter tickets
  const filtered = tickets.filter((ticket) => {
    const matchSearch = !search || ticket.number.includes(search.trim());
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchDate = !dateFilter || ticket.draw_date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  async function handleBuy(ticketId) {
    const result = await purchaseTicket(ticketId);
    setToast(result.success ? { type: 'success', msg: t.buySuccess } : { type: 'error', msg: result.message || t.buyFail });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div style={styles.page}>
      {/* Toast notification */}
      {toast && (
        <div style={{ ...styles.toast, ...(toast.type === 'success' ? styles.toastSuccess : styles.toastError) }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>
        {/* Lang toggle */}
        <div style={styles.langToggle}>
          <button style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langBtnActive : {}) }} onClick={() => setLang('en')}>EN</button>
          <button style={{ ...styles.langBtn, ...(lang === 'th' ? styles.langBtnActive : {}) }} onClick={() => setLang('th')}>TH</button>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {/* Search */}
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Draw date filter */}
        <select
          style={styles.select}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="">{t.allDates}</option>
          {drawDates.map((d) => (
            <option key={d} value={d}>
              {new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <div style={styles.statusTabs}>
          {['all', 'available', 'sold'].map((s) => (
            <button
              key={s}
              style={{ ...styles.statusTab, ...(statusFilter === s ? styles.statusTabActive : {}) }}
              onClick={() => setStatusFilter(s)}
            >
              {t[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p style={styles.resultCount}>
          <span style={{ color: colors.gold400, fontWeight: 700 }}>{filtered.length}</span>
          {' '}{t.results}
        </p>
      )}

      {/* Ticket grid */}
      <TicketGrid
        tickets={filtered}
        onBuy={handleBuy}
        buying={buying}
        loading={loading}
        lang={lang}
      />
      <LineContact />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0a0700 0%, #1c1400 50%, #0a0700 100%)',
    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif",
    position: 'relative',
  },
  toast: {
    position: 'fixed',
    top: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.875rem 1.5rem',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.9rem',
    zIndex: 9999,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
  },
  toastSuccess: {
    background: '#052e16',
    color: '#4ade80',
    border: '1px solid #166534',
  },
  toastError: {
    background: '#3b0000',
    color: '#f87171',
    border: '1px solid #7f1d1d',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: '#a8936a',
    fontSize: '0.95rem',
  },
  langToggle: {
    display: 'flex',
    gap: '0.2rem',
    background: '#1c1400',
    border: '1px solid #3d2e00',
    borderRadius: '10px',
    padding: '0.2rem',
  },
  langBtn: {
    padding: '0.3rem 0.7rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.75rem',
    background: 'transparent',
    color: '#a8936a',
    fontFamily: 'inherit',
  },
  langBtnActive: {
    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.875rem',
    marginBottom: '1.5rem',
    alignItems: 'center',
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#1c1400',
    border: '1.5px solid #3d2e00',
    borderRadius: '10px',
    padding: '0 0.875rem',
    flex: '1 1 220px',
    minWidth: '180px',
  },
  searchIcon: {
    fontSize: '1rem',
    opacity: 0.6,
    marginRight: '0.5rem',
  },
  searchInput: {
    flex: 1,
    padding: '0.7rem 0',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fef3c7',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#6b5a3e',
    cursor: 'pointer',
    fontSize: '0.8rem',
    padding: '0.25rem',
  },
  select: {
    padding: '0.7rem 1rem',
    background: '#1c1400',
    border: '1.5px solid #3d2e00',
    borderRadius: '10px',
    color: '#fef3c7',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    cursor: 'pointer',
    flex: '0 1 200px',
  },
  statusTabs: {
    display: 'flex',
    gap: '0.3rem',
    background: '#1c1400',
    border: '1px solid #3d2e00',
    borderRadius: '10px',
    padding: '0.2rem',
  },
  statusTab: {
    padding: '0.4rem 0.875rem',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
    background: 'transparent',
    color: '#a8936a',
    fontFamily: 'inherit',
    transition: 'background 0.15s, color 0.15s',
  },
  statusTabActive: {
    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00',
  },
  resultCount: {
    color: '#6b5a3e',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
  },
};