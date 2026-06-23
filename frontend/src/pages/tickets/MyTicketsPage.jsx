import { useState, useEffect } from 'react';
import { getMyTickets } from '../../api/tickets.api';
import { Link } from 'react-router-dom';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const TEXT = {
  en: {
    title: 'My Tickets',
    subtitle: 'Tickets you have purchased',
    empty: 'You have no tickets yet',
    emptyHint: 'Browse and buy tickets to see them here',
    drawDate: 'Draw Date',
    purchased: 'Purchased',
    paid: 'Paid',
    status: 'Status',
    set: 'Set',
    series: 'Series',
    statuses: {
      available: 'Active',
      sold: 'Owned',
      reserved: 'Reserved',
    },
  },
  th: {
    title: 'สลากของฉัน',
    subtitle: 'สลากที่คุณซื้อไว้',
    empty: 'คุณยังไม่มีสลาก',
    emptyHint: 'ซื้อสลากเพื่อดูที่นี่',
    drawDate: 'วันออกรางวัล',
    purchased: 'ซื้อเมื่อ',
    paid: 'ราคาที่จ่าย',
    status: 'สถานะ',
    set: 'ชุด',
    series: 'งวด',
    statuses: {
      available: 'ใช้งานได้',
      sold: 'เป็นเจ้าของ',
      reserved: 'จองแล้ว',
    },
  },
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const t = TEXT[lang];

  useEffect(() => {
    getMyTickets()
      .then((res) => setTickets(res.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
        <Link to="/tickets" style={styles.backLink}>← Back to Browse</Link>
        
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>
        <div style={styles.langToggle}>
          <button style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langBtnActive : {}) }} onClick={() => setLang('en')}>EN</button>
          <button style={{ ...styles.langBtn, ...(lang === 'th' ? styles.langBtnActive : {}) }} onClick={() => setLang('th')}>TH</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.center}><div style={styles.spinner} /></div>
      ) : tickets.length === 0 ? (
        <div style={styles.center}>
          <span style={{ fontSize: '3rem' }}>🎟</span>
          <p style={styles.emptyTitle}>{t.empty}</p>
          <p style={styles.emptyHint}>{t.emptyHint}</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {tickets.map((ticket) => (
            <div key={ticket.id} style={styles.card}>
              {/* Image */}
              <div style={styles.imageWrap}>
                {ticket.image_url ? (
                  <img
                    src={`${SERVER_URL}${ticket.image_url}`}
                    alt={ticket.number}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.imagePlaceholder}>
                    <span style={styles.placeholderIcon}>🎟</span>
                    <span style={styles.placeholderNumber}>{ticket.number}</span>
                  </div>
                )}

                {/* Owned badge */}
                <div style={styles.ownedBadge}>✓ Owned</div>
              </div>

              {/* Info */}
              <div style={styles.info}>
                <div style={styles.numberRow}>
                  <span style={styles.number}>{ticket.number}</span>
                </div>

                <div style={styles.metaGrid}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>{t.drawDate}</span>
                    <span style={styles.metaValue}>
                      {new Date(ticket.draw_date).toLocaleDateString(
                        lang === 'th' ? 'th-TH' : 'en-US',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )}
                    </span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>{t.paid}</span>
                    <span style={{ ...styles.metaValue, color: '#fbbf24', fontWeight: 700 }}>
                      ฿{Number(ticket.paid_amount).toLocaleString()}
                    </span>
                  </div>
                  {ticket.set && (
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>{t.set}</span>
                      <span style={styles.metaValue}>{ticket.set}</span>
                    </div>
                  )}
                  {ticket.series && (
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>{t.series}</span>
                      <span style={styles.metaValue}>{ticket.series}</span>
                    </div>
                  )}
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>{t.purchased}</span>
                    <span style={styles.metaValue}>
                      {new Date(ticket.purchased_at).toLocaleDateString(
                        lang === 'th' ? 'th-TH' : 'en-US',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif" },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
  },
  title: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900,
    background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', letterSpacing: '-0.02em', marginBottom: '0.25rem',
  },
  subtitle: { color: '#a8936a', fontSize: '0.95rem' },
  langToggle: {
    display: 'flex', gap: '0.2rem', background: '#1c1400',
    border: '1px solid #3d2e00', borderRadius: '10px', padding: '0.2rem',
  },
  langBtn: {
    padding: '0.3rem 0.7rem', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem',
    background: 'transparent', color: '#a8936a', fontFamily: 'inherit',
  },
  langBtnActive: { background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#0f0a00' },
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '5rem 1rem', gap: '1rem',
  },
  spinner: {
    width: '36px', height: '36px', border: '3px solid #3d2e00',
    borderTopColor: '#f59e0b', borderRadius: '50%',
    animation: 'spin 0.65s linear infinite',
  },
  emptyTitle: { fontSize: '1.25rem', fontWeight: 700, color: '#fcd34d' },
  emptyHint: { color: '#a8936a', fontSize: '0.9rem', textAlign: 'center' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'linear-gradient(145deg, #1c1400, #2a1f00)',
    border: '1px solid #d97706',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(245,158,11,0.1)',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4/3',
    overflow: 'hidden',
    background: '#0a0700',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imagePlaceholder: {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #1c1400, #2a1f00)',
    gap: '0.75rem',
  },
  placeholderIcon: { fontSize: '2.5rem', opacity: 0.4 },
  placeholderNumber: {
    fontSize: '1.75rem', fontWeight: 900, color: '#fcd34d',
    letterSpacing: '0.2em', fontFamily: 'monospace',
  },
  ownedBadge: {
    position: 'absolute', top: '12px', left: '12px',
    background: 'linear-gradient(135deg, #064e3b, #065f46)',
    color: '#4ade80', border: '1px solid #166534',
    padding: '0.25rem 0.75rem', borderRadius: '99px',
    fontSize: '0.75rem', fontWeight: 700,
  },
  info: { padding: '1rem' },
  numberRow: { marginBottom: '0.75rem' },
  number: {
    fontSize: '1.5rem', fontWeight: 900, color: '#fcd34d',
    letterSpacing: '0.12em', fontFamily: 'monospace',
  },
  metaGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  metaItem: { display: 'flex', flexDirection: 'column', gap: '0.1rem' },
  metaLabel: {
    fontSize: '0.65rem', color: '#6b5a3e',
    textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
  },
  metaValue: { fontSize: '0.8rem', color: '#fef3c7', fontWeight: 600 },
  backLink: {
  display: 'inline-block',
  color: '#a8936a',
  fontSize: '0.875rem',
  textDecoration: 'none',
  marginBottom: '1.25rem',
  fontWeight: 500,
},
};
