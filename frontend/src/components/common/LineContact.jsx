import { useState } from 'react';

const LINE_ID = 'kopyae698';
const LINE_URL = `https://line.me/ti/p/~${LINE_ID}`;
const LINE_PHONE = '0644594065';

export default function LineContact() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button style={styles.fab} onClick={() => setOpen(true)} title="Contact Admin via Line">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
          alt="Line"
          style={styles.fabIcon}
        />
        <span style={styles.fabLabel}>Contact</span>
      </button>

      {/* Modal */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>

            <div style={styles.lineHeader}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                alt="Line"
                style={styles.lineIcon}
              />
              <div>
                <h2 style={styles.modalTitle}>Contact Admin</h2>
                <p style={styles.modalSubtitle}>We're here to help 24/7</p>
              </div>
            </div>

            {/* QR Code */}
            <div style={styles.qrWrap}>
              <img src="/line-qr.png" alt="Line QR Code" style={styles.qrImage}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Info */}
            <div style={styles.infoBox}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Line ID</span>
                <span style={styles.infoValue}>@{LINE_ID}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                <span style={styles.infoValue}>{LINE_PHONE}</span>
              </div>
            </div>

            {/* Buttons */}
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={styles.lineBtn}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                alt="Line"
                style={{ width: '20px', height: '20px' }}
              />
              Open in Line App
            </a>

            <a href={`tel:${LINE_PHONE}`} style={styles.phoneBtn}>
              📞 Call {LINE_PHONE}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#06C755',
    border: 'none',
    borderRadius: '99px',
    padding: '0.75rem 1.25rem',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(6,199,85,0.4)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  fabIcon: { width: '24px', height: '24px' },
  fabLabel: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9rem',
    fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif",
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  },
  modal: {
    background: '#1c1400',
    border: '1px solid #3d2e00',
    borderRadius: '20px',
    padding: '1.75rem',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: '1rem', right: '1rem',
    background: 'none', border: 'none',
    color: '#6b5a3e', fontSize: '1.1rem',
    cursor: 'pointer', padding: '0.25rem',
  },
  lineHeader: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    marginBottom: '1.5rem',
  },
  lineIcon: { width: '48px', height: '48px' },
  modalTitle: { fontSize: '1.25rem', fontWeight: 800, color: '#fcd34d', margin: 0 },
  modalSubtitle: { color: '#a8936a', fontSize: '0.85rem', margin: 0 },
  qrWrap: {
    display: 'flex', justifyContent: 'center',
    marginBottom: '1.25rem',
    background: '#fff',
    borderRadius: '12px',
    padding: '1rem',
  },
  qrImage: { width: '180px', height: '180px', objectFit: 'contain' },
  infoBox: {
    background: '#2a1f00',
    border: '1px solid #3d2e00',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: '0.8rem', color: '#a8936a', fontWeight: 600 },
  infoValue: { fontSize: '0.95rem', color: '#fef3c7', fontWeight: 700 },
  lineBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '0.5rem', width: '100%', padding: '0.875rem',
    background: '#06C755', color: '#fff',
    border: 'none', borderRadius: '12px',
    fontSize: '0.95rem', fontWeight: 800,
    textDecoration: 'none', marginBottom: '0.75rem',
    fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif",
    boxSizing: 'border-box',
  },
  phoneBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', padding: '0.875rem',
    background: 'transparent', color: '#fcd34d',
    border: '1.5px solid #3d2e00', borderRadius: '12px',
    fontSize: '0.95rem', fontWeight: 700,
    textDecoration: 'none',
    fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif",
    boxSizing: 'border-box',
  },
};