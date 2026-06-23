import { useState, useEffect } from 'react';
import { uploadTicket, deleteTicket, getAllTickets } from '../../api/admin.api';
import client from '../../api/client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ number: '', price: '', draw_date: '', set: '', series: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [drawForm, setDrawForm] = useState({
    draw_date: '', first_prize: '',
    second_prize: '', third_prize: '',
    fourth_prize: '', fifth_prize: '',
    front3: '', last3: '', last2: '',
  });
  const [drawSubmitting, setDrawSubmitting] = useState(false);
  const [drawError, setDrawError] = useState('');
  const [drawSuccess, setDrawSuccess] = useState('');

  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);

  async function loadTickets() {
    setLoading(true);
    try {
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  async function loadWithdrawals() {
    setLoadingWithdrawals(true);
    try {
      const res = await client.get('/admin/withdrawals');
      setPendingWithdrawals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWithdrawals(false);
    }
  }

  async function handleReview(id, status) {
    const adminNote = status === 'rejected' ? prompt('Reason for rejection (optional):') : '';
    try {
      await client.patch(`/admin/withdrawals/${id}`, { status, adminNote });
      loadWithdrawals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process');
    }
  }

  useEffect(() => { loadTickets(); }, []);

  function onChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }
  function onDrawChange(e) { setDrawForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  function onImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.number || !form.price || !form.draw_date) {
      setError('Number, price, and draw date are required'); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('number', form.number);
      fd.append('price', form.price);
      fd.append('draw_date', form.draw_date);
      fd.append('set', form.set);
      fd.append('series', form.series);
      if (imageFile) fd.append('image', imageFile);
      await uploadTicket(fd);
      setSuccess('🎉 Ticket added successfully!');
      setForm({ number: '', price: '', draw_date: '', set: '', series: '' });
      setImageFile(null); setPreview(null);
      loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add ticket');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this ticket?')) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete ticket');
    }
  }

  async function handleDrawSubmit(e) {
    e.preventDefault();
    setDrawError(''); setDrawSuccess('');
    if (!drawForm.draw_date || !drawForm.first_prize) {
      setDrawError('Draw date and 1st prize are required'); return;
    }
    const firstNum = parseInt(drawForm.first_prize);
    const adjacent = [
      String(firstNum - 1).padStart(6, '0'),
      String(firstNum + 1).padStart(6, '0'),
    ];
    setDrawSubmitting(true);
    try {
      await client.post('/admin/draw/result', {
        drawDate: drawForm.draw_date,
        winningNumbers: {
          first_prize:  drawForm.first_prize,
          adjacent,
          second_prize: drawForm.second_prize.split(',').map(s => s.trim()).filter(Boolean),
          third_prize:  drawForm.third_prize.split(',').map(s => s.trim()).filter(Boolean),
          fourth_prize: drawForm.fourth_prize.split(',').map(s => s.trim()).filter(Boolean),
          fifth_prize:  drawForm.fifth_prize.split(',').map(s => s.trim()).filter(Boolean),
          front3:       drawForm.front3.split(',').map(s => s.trim()).filter(Boolean),
          last3:        drawForm.last3.split(',').map(s => s.trim()).filter(Boolean),
          last2:        [drawForm.last2.trim()].filter(Boolean),
        }
      });
      setDrawSuccess('🎉 Draw result saved!');
      setDrawForm({
        draw_date: '', first_prize: '', second_prize: '',
        third_prize: '', fourth_prize: '', fifth_prize: '',
        front3: '', last3: '', last2: '',
      });
    } catch (err) {
      setDrawError(err.response?.data?.message || 'Failed to save draw result');
    } finally {
      setDrawSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>

      {/* ── Ticket Upload ── */}
      <h1 style={styles.title}>🎟 Manage Tickets</h1>
      <p style={styles.subtitle}>Add new tickets with photos</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Ticket Number</label>
            <input name="number" value={form.number} onChange={onChange} placeholder="123456" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Price (฿)</label>
            <input name="price" type="number" value={form.price} onChange={onChange} placeholder="100" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Draw Date</label>
            <input name="draw_date" type="date" value={form.draw_date} onChange={onChange} style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Set (optional)</label>
            <input name="set" value={form.set} onChange={onChange} placeholder="01" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Series (optional)</label>
            <input name="series" value={form.series} onChange={onChange} placeholder="01" style={styles.input} />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Ticket Photo</label>
          <label style={styles.uploadBox}>
            {preview ? (
              <img src={preview} alt="preview" style={styles.previewImg} />
            ) : (
              <span style={styles.uploadText}>📷 Click to upload photo</span>
            )}
            <input type="file" accept="image/*" onChange={onImageChange} style={{ display: 'none' }} />
          </label>
        </div>

        <button type="submit" style={{ ...styles.submitBtn, ...(submitting ? styles.btnDisabled : {}) }} disabled={submitting}>
          {submitting ? 'Adding...' : '+ Add Ticket'}
        </button>
      </form>

      {/* ── Ticket List ── */}
      <h2 style={styles.sectionTitle}>All Tickets ({tickets.length})</h2>
      {loading ? (
        <p style={{ color: '#a8936a' }}>Loading...</p>
      ) : (
        <div style={styles.list}>
          {tickets.map((ticket) => (
            <div key={ticket.id} style={styles.row}>
              <div style={styles.rowImage}>
                {ticket.image_url ? (
                  <img src={`${SERVER_URL}${ticket.image_url}`} alt="" style={styles.rowImg} />
                ) : (
                  <div style={styles.rowImgPlaceholder}>🎟</div>
                )}
              </div>
              <div style={styles.rowInfo}>
                <span style={styles.rowNumber}>{ticket.number}</span>
                <span style={styles.rowMeta}>
                  ฿{Number(ticket.price).toLocaleString()} · {ticket.draw_date} · {ticket.status}
                </span>
              </div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(ticket.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* ── Draw Results ── */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '3rem' }}>🏆 Enter Draw Result</h2>
      <p style={styles.subtitle}>Adjacent 1st Prize numbers are calculated automatically</p>

      <form onSubmit={handleDrawSubmit} style={styles.form}>
        {drawError && <div style={styles.errorBox}>{drawError}</div>}
        {drawSuccess && <div style={styles.successBox}>{drawSuccess}</div>}

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Draw Date</label>
            <input name="draw_date" type="date" value={drawForm.draw_date} onChange={onDrawChange} style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>🥇 1st Prize (6 digits)</label>
            <input name="first_prize" value={drawForm.first_prize} onChange={onDrawChange} placeholder="123456" maxLength={6} style={styles.input} />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>🥈 2nd Prize — 5 numbers (comma separated)</label>
          <input name="second_prize" value={drawForm.second_prize} onChange={onDrawChange} placeholder="234567, 345678, 456789, 567890, 678901" style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>🥉 3rd Prize — 10 numbers (comma separated)</label>
          <input name="third_prize" value={drawForm.third_prize} onChange={onDrawChange} placeholder="111111, 222222, 333333, ..." style={styles.input} />
        </div>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>4th Prize — 50 numbers (comma separated)</label>
            <input name="fourth_prize" value={drawForm.fourth_prize} onChange={onDrawChange} placeholder="100001, 100002, ..." style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>5th Prize — 100 numbers (comma separated)</label>
            <input name="fifth_prize" value={drawForm.fifth_prize} onChange={onDrawChange} placeholder="200001, 200002, ..." style={styles.input} />
          </div>
        </div>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Front 3 Digits — 2 sets (comma separated)</label>
            <input name="front3" value={drawForm.front3} onChange={onDrawChange} placeholder="123, 456" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Last 3 Digits — 2 sets (comma separated)</label>
            <input name="last3" value={drawForm.last3} onChange={onDrawChange} placeholder="456, 789" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Last 2 Digits — 1 set</label>
            <input name="last2" value={drawForm.last2} onChange={onDrawChange} placeholder="56" maxLength={2} style={styles.input} />
          </div>
        </div>

        <button type="submit" style={{ ...styles.submitBtn, ...(drawSubmitting ? styles.btnDisabled : {}) }} disabled={drawSubmitting}>
          {drawSubmitting ? 'Saving...' : '🏆 Save Draw Result'}
        </button>
      </form>

      {/* ── Withdrawal Requests ── */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '3rem' }}>💸 Review Withdrawal Requests</h2>
      <button
        type="button"
        style={{ ...styles.submitBtn, width: 'fit-content', padding: '0.75rem 1.5rem', marginBottom: '1.5rem' }}
        onClick={loadWithdrawals}
        disabled={loadingWithdrawals}
      >
        {loadingWithdrawals ? 'Loading...' : 'Load Pending Requests'}
      </button>

      {pendingWithdrawals.length > 0 && (
        <div style={styles.withdrawalList}>
          {pendingWithdrawals.map((w) => (
            <div key={w.id} style={styles.withdrawalRow}>
              <div style={styles.withdrawalInfo}>
                <div style={styles.withdrawalUser}>{w.name} ({w.email})</div>
                <div style={styles.withdrawalMeta}>
                  ฿{Number(w.amount).toLocaleString()} → {w.bank_name} · {w.account_number} · {w.account_name}
                </div>
                <div style={styles.withdrawalDate}>{new Date(w.created_at).toLocaleString()}</div>
              </div>
              <div style={styles.withdrawalActions}>
                <button style={styles.approveBtn} onClick={() => handleReview(w.id, 'approved')}>
                  ✅ Approve
                </button>
                <button style={styles.rejectBtn} onClick={() => handleReview(w.id, 'rejected')}>
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingWithdrawals.length === 0 && !loadingWithdrawals && (
        <p style={{ color: '#6b5a3e', fontSize: '0.9rem' }}>
          Click "Load Pending Requests" to check for new withdrawal requests.
        </p>
      )}

    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif" },
  title: { fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#fcd34d' },
  subtitle: { color: '#a8936a', fontSize: '0.9rem', marginBottom: '1.5rem' },
  form: {
    background: '#1c1400', border: '1px solid #3d2e00',
    borderRadius: '16px', padding: '1.5rem', marginBottom: '2.5rem',
  },
  formGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem', marginBottom: '1rem',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#fde68a' },
  input: {
    padding: '0.7rem 0.875rem', background: '#2a1f00',
    border: '1.5px solid #3d2e00', borderRadius: '10px',
    color: '#fef3c7', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none',
  },
  uploadBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', maxWidth: '280px', height: '180px',
    background: '#2a1f00', border: '2px dashed #3d2e00',
    borderRadius: '12px', cursor: 'pointer', overflow: 'hidden', margin: '0 auto',
  },
  uploadText: { color: '#a8936a', fontSize: '0.9rem', textAlign: 'center', padding: '0 1rem' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  submitBtn: {
    width: '100%', padding: '0.875rem',
    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00', border: 'none', borderRadius: '10px',
    fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
    marginTop: '0.5rem', fontFamily: 'inherit',
  },
  btnDisabled: { opacity: 0.45, cursor: 'not-allowed' },
  errorBox: {
    background: '#3b0000', color: '#f87171', border: '1px solid #7f1d1d',
    borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  successBox: {
    background: '#052e16', color: '#4ade80', border: '1px solid #166534',
    borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 800, color: '#fcd34d', marginBottom: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' },
  row: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: '#1c1400', border: '1px solid #3d2e00',
    borderRadius: '12px', padding: '0.75rem 1rem',
  },
  rowImage: { width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 },
  rowImg: { width: '100%', height: '100%', objectFit: 'cover' },
  rowImgPlaceholder: {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#2a1f00', fontSize: '1.5rem',
  },
  rowInfo: { display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, minWidth: 0 },
  rowNumber: { fontSize: '1rem', fontWeight: 700, color: '#fef3c7', fontFamily: 'monospace' },
  rowMeta: { fontSize: '0.8rem', color: '#a8936a' },
  deleteBtn: {
    padding: '0.5rem 1rem', background: '#3b0000', color: '#f87171',
    border: '1px solid #7f1d1d', borderRadius: '8px', fontSize: '0.8rem',
    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
  },
  withdrawalList: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
  withdrawalRow: {
    display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center',
    background: '#1c1400', border: '1px solid #3d2e00',
    borderRadius: '12px', padding: '1rem',
  },
  withdrawalInfo: { display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, minWidth: '200px' },
  withdrawalUser: { fontSize: '1rem', fontWeight: 700, color: '#fef3c7' },
  withdrawalMeta: { fontSize: '0.9rem', color: '#eab308' },
  withdrawalDate: { fontSize: '0.8rem', color: '#a8936a' },
  withdrawalActions: { display: 'flex', gap: '0.75rem', flexShrink: 0 },
  approveBtn: {
    padding: '0.65rem 1.25rem', background: '#064e3b', color: '#a7f3d0',
    border: '1px solid #065f46', borderRadius: '10px', cursor: 'pointer',
    fontWeight: 700, fontFamily: 'inherit',
  },
  rejectBtn: {
    padding: '0.65rem 1.25rem', background: '#7f1d1d', color: '#fecaca',
    border: '1px solid #991b1b', borderRadius: '10px', cursor: 'pointer',
    fontWeight: 700, fontFamily: 'inherit',
  },
};