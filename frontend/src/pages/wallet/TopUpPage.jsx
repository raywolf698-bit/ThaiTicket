import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

const QUICK_AMOUNTS = [100, 300, 500, 1000, 2000, 5000];

const METHODS = [
  { id: 'promptpay', icon: '📱', name: 'PromptPay', desc: 'QR Code Payment' },
  { id: 'wave', icon: '🌊', name: 'Wave Money', desc: 'Mobile Wallet' },
  { id: 'grabpay', icon: '🚗', name: 'GrabPay', desc: 'Digital Wallet' },
  { id: 'usdt', icon: '₮', name: 'USDT', desc: 'Crypto (TRC20)' },
];

const TEXT = {
  en: {
    title: 'Top Up Wallet',
    subtitle: 'Add funds to your account',
    back: '← Back to Wallet',
    amount: 'Amount (THB)',
    method: 'Payment Method',
    confirm: 'Confirm Top Up',
    success: '🎉 Top up successful!',
    fail: 'Top up failed. Please try again.',
    custom: 'Custom amount',
  },
  th: {
    title: 'เติมเงิน',
    subtitle: 'เพิ่มเงินเข้าบัญชีของคุณ',
    back: '← กลับไปที่กระเป๋าเงิน',
    amount: 'จำนวนเงิน (บาท)',
    method: 'วิธีการชำระเงิน',
    confirm: 'ยืนยันการเติมเงิน',
    success: '🎉 เติมเงินสำเร็จ!',
    fail: 'เติมเงินไม่สำเร็จ กรุณาลองใหม่',
    custom: 'จำนวนเงินอื่น',
  },
};

export default function TopUpPage() {
  const { topUp } = useWallet();
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const t = TEXT[lang];

  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState('promptpay');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleConfirm() {
    if (!finalAmount || finalAmount <= 0) return;
    setLoading(true);
    const result = await topUp(finalAmount, method);
    setLoading(false);

    if (result.success) {
      setToast({ type: 'success', msg: t.success });
      setTimeout(() => navigate('/wallet'), 1200);
    } else {
      setToast({ type: 'error', msg: result.message || t.fail });
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <div style={styles.page}>
      {toast && (
        <div style={{ ...styles.toast, ...(toast.type === 'success' ? styles.toastSuccess : styles.toastError) }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <Link to="/wallet" style={styles.backLink}>{t.back}</Link>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>
        <div style={styles.langToggle}>
          <button style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langBtnActive : {}) }} onClick={() => setLang('en')}>EN</button>
          <button style={{ ...styles.langBtn, ...(lang === 'th' ? styles.langBtnActive : {}) }} onClick={() => setLang('th')}>TH</button>
        </div>
      </div>

      <div style={styles.card}>
        {/* Amount */}
        <h3 style={styles.sectionLabel}>{t.amount}</h3>
        <div style={styles.amountGrid}>
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              style={{ ...styles.amountBtn, ...(amount === a && !customAmount ? styles.amountBtnActive : {}) }}
              onClick={() => { setAmount(a); setCustomAmount(''); }}
            >
              ฿{a.toLocaleString()}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder={t.custom}
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          style={styles.customInput}
        />

        {/* Payment methods */}
        <h3 style={{ ...styles.sectionLabel, marginTop: '2rem' }}>{t.method}</h3>
        <div style={styles.methodGrid}>
          {METHODS.map((m) => (
            <button
              key={m.id}
              style={{ ...styles.methodCard, ...(method === m.id ? styles.methodCardActive : {}) }}
              onClick={() => setMethod(m.id)}
            >
              <span style={styles.methodIcon}>{m.icon}</span>
              <div style={styles.methodInfo}>
                <span style={styles.methodName}>{m.name}</span>
                <span style={styles.methodDesc}>{m.desc}</span>
              </div>
              {method === m.id && <span style={styles.checkmark}>✓</span>}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <span style={styles.summaryLabel}>Total</span>
          <span style={styles.summaryAmount}>฿{(finalAmount || 0).toLocaleString()}</span>
        </div>

        <button
          style={{ ...styles.confirmBtn, ...(loading || !finalAmount ? styles.btnDisabled : {}) }}
          onClick={handleConfirm}
          disabled={loading || !finalAmount}
        >
          {loading ? '...' : t.confirm}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif", position: 'relative' },
  toast: {
    position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
    padding: '0.875rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem',
    zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
  },
  toastSuccess: { background: '#052e16', color: '#4ade80', border: '1px solid #166534' },
  toastError: { background: '#3b0000', color: '#f87171', border: '1px solid #7f1d1d' },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
  },
  backLink: {
    display: 'inline-block', color: '#a8936a', fontSize: '0.85rem',
    textDecoration: 'none', marginBottom: '0.5rem',
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

  card: {
    background: '#1c1400',
    border: '1px solid #3d2e00',
    borderRadius: '20px',
    padding: 'clamp(1.25rem, 3vw, 2rem)',
    maxWidth: '600px',
  },
  sectionLabel: {
    fontSize: '0.9rem', fontWeight: 700, color: '#fde68a',
    marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  amountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '0.625rem',
    marginBottom: '0.875rem',
  },
  amountBtn: {
    padding: '0.875rem',
    background: '#2a1f00',
    border: '1.5px solid #3d2e00',
    borderRadius: '12px',
    color: '#fef3c7',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, background 0.15s',
  },
  amountBtnActive: {
    border: '1.5px solid #f59e0b',
    background: 'linear-gradient(135deg, rgba(217,119,6,0.2), rgba(251,191,36,0.1))',
    color: '#fcd34d',
  },
  customInput: {
    width: '100%',
    padding: '0.875rem 1rem',
    background: '#2a1f00',
    border: '1.5px solid #3d2e00',
    borderRadius: '12px',
    color: '#fef3c7',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
  },
  methodGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
  },
  methodCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.875rem 1.1rem',
    background: '#2a1f00',
    border: '1.5px solid #3d2e00',
    borderRadius: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    transition: 'border-color 0.15s, background 0.15s',
  },
  methodCardActive: {
    border: '1.5px solid #f59e0b',
    background: 'linear-gradient(135deg, rgba(217,119,6,0.15), rgba(251,191,36,0.05))',
  },
  methodIcon: { fontSize: '1.5rem', width: '36px', textAlign: 'center', flexShrink: 0 },
  methodInfo: { display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1 },
  methodName: { fontSize: '0.95rem', fontWeight: 700, color: '#fef3c7' },
  methodDesc: { fontSize: '0.75rem', color: '#a8936a' },
  checkmark: {
    width: '24px', height: '24px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 900, flexShrink: 0,
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.1rem 0',
    marginTop: '1.5rem',
    borderTop: '1px solid #3d2e00',
  },
  summaryLabel: { fontSize: '1rem', fontWeight: 700, color: '#a8936a' },
  summaryAmount: { fontSize: '1.5rem', fontWeight: 900, color: '#fcd34d' },
  confirmBtn: {
    width: '100%',
    padding: '0.95rem',
    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
    fontFamily: 'inherit',
  },
  btnDisabled: { opacity: 0.45, cursor: 'not-allowed', boxShadow: 'none' },
};