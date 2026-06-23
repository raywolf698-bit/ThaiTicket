import TicketCard from './TicketCard';

export default function TicketGrid({ tickets, onBuy, buying, loading, lang }) {
  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading tickets...</p>
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div style={styles.center}>
        <div style={styles.emptyIcon}>🎟</div>
        <p style={styles.emptyTitle}>No tickets available</p>
        <p style={styles.emptyText}>Check back soon for new tickets</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} onBuy={onBuy} buying={buying} lang={lang} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 2rem',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #3d2e00',
    borderTopColor: '#f59e0b',
    borderRadius: '50%',
    animation: 'spin 0.65s linear infinite',
  },
  loadingText: { color: '#a8936a', fontSize: '0.9rem' },
  emptyIcon: { fontSize: '3rem' },
  emptyTitle: { fontSize: '1.25rem', fontWeight: 700, color: '#fcd34d' },
  emptyText: { color: '#a8936a', fontSize: '0.9rem', textAlign: 'center' },
};