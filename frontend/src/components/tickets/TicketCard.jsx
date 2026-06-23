import { colors } from '../../styles/theme';

export default function TicketCard({ ticket, onBuy, buying, lang }) {
  const isSold = ticket.status === 'sold';
  const isBuying = buying === ticket.id;

  const labels = {
    en: { buy: 'Buy Now', sold: 'Sold Out' },
    th: { buy: 'ซื้อเลย', sold: 'ขายแล้ว' },
  };
  const l = labels[lang] || labels.en;

  return (
    <div style={{ ...styles.card, ...(isSold ? styles.cardSold : {}) }}>
      {/* Ticket image */}
      <div style={styles.imageWrap}>
        {ticket.image_url ? (
  <img src={`${import.meta.env.VITE_SERVER_URL}${ticket.image_url}`} alt={`Ticket ${ticket.number}`} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>
            <span style={styles.placeholderIcon}>🎟</span>
            <span style={styles.placeholderNumber}>{ticket.number}</span>
          </div>
        )}

        {isSold && (
          <div style={styles.soldOverlay}>
            <span style={styles.soldText}>SOLD</span>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div style={styles.info}>
        <div style={styles.left}>
          <span style={styles.number}>{ticket.number}</span>
          <span style={styles.price}>฿{Number(ticket.price).toLocaleString()}</span>
        </div>

        <button
          style={{ ...styles.buyBtn, ...(isSold || isBuying ? styles.buyBtnDisabled : {}) }}
          onClick={() => !isSold && onBuy(ticket.id)}
          disabled={isSold || isBuying}
        >
          {isBuying ? '...' : isSold ? l.sold : l.buy}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#1c1400',
    border: '1px solid #3d2e00',
    borderRadius: '18px',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
  },
  cardSold: {
    opacity: 0.55,
    filter: 'grayscale(40%)',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4/3',
    overflow: 'hidden',
    background: '#0a0700',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1c1400, #2a1f00)',
    gap: '0.75rem',
  },
  placeholderIcon: {
    fontSize: '2.5rem',
    opacity: 0.5,
  },
  placeholderNumber: {
    fontSize: '1.75rem',
    fontWeight: 900,
    color: '#fcd34d',
    letterSpacing: '0.2em',
    fontFamily: 'monospace',
  },
  soldOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(10,7,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#f87171',
    border: '3px solid #f87171',
    padding: '0.25rem 1.25rem',
    borderRadius: '6px',
    letterSpacing: '0.15em',
    transform: 'rotate(-12deg)',
    background: 'rgba(0,0,0,0.3)',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1.1rem',
    gap: '0.75rem',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    minWidth: 0,
  },
  number: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#fef3c7',
    fontFamily: 'monospace',
    letterSpacing: '0.08em',
  },
  price: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fbbf24',
  },
  buyBtn: {
    padding: '0.6rem 1.25rem',
    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(245,158,11,0.3)',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    transition: 'filter 0.15s',
  },
  buyBtnDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
    boxShadow: 'none',
    background: '#3d2e00',
    color: '#6b5a3e',
  },
};