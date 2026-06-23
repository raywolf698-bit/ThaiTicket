import { useState } from 'react';
import { requestWithdraw } from '../../api/wallet.api';

const TEXT = {
  en: {
    title: 'Withdraw Funds',
    amount: 'Amount (THB)',
    bank: 'Bank Name',
    accountNumber: 'Account Number',
    accountName: 'Account Holder Name',
    submit: 'Submit Request',
    cancel: 'Cancel',
    success: '✅ Withdrawal request submitted! Admin will process within 24 hours.',
    minAmount: 'Minimum withdrawal is ฿100',
    insufficientBalance: 'Amount exceeds your balance',
    selectBank: 'Select bank...',
  },
  th: {
    title: 'ถอนเงิน',
    amount: 'จำนวนเงิน (บาท)',
    bank: 'ธนาคาร',
    accountNumber: 'เลขบัญชี',
    accountName: 'ชื่อเจ้าของบัญชี',
    submit: 'ส่งคำขอถอนเงิน',
    cancel: 'ยกเลิก',
    success: '✅ ส่งคำขอถอนเงินแล้ว! แอดมินจะดำเนินการภายใน 24 ชั่วโมง',
    minAmount: 'ถอนขั้นต่ำ ฿100',
    insufficientBalance: 'จำนวนเงินเกินยอดคงเหลือ',
    selectBank: 'เลือกธนาคาร...',
  },
};

export default function WithdrawModal({ balance, banks, lang, onClose, onSuccess }) {
  const t = TEXT[lang] || TEXT.en;
  const [form, setForm] = useState({ amount: '', bankName: '', accountNumber: '', accountName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const amount = Number(form.amount);
    if (!amount || amount < 100) { setError(t.minAmount); return; }
    if (amount > balance) { setError(t.insufficientBalance); return; }
    if (!form.bankName || !form.accountNumber || !form.accountName) {
      setError('All fields are required'); return;
    }

    setLoading(true);
    try {
      await requestWithdraw(form);
      setSuccess(t.success);
      setTimeout(onSuccess, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{t.title}</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.balanceInfo}>
          Available: <span style={{ color: '#fcd34d', fontWeight: 800 }}>
            ฿{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {success ? (
          <div style={styles.successBox}>{success}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.field}>
              <label style={styles.label}>{t.amount}</label>
              <input
                name="amount" type="number" value={form.amount}
                onChange={onChange} placeholder="100" style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>{t.bank}</label>
              <select name="bankName" value={form.bankName} onChange={onChange} style={styles.input}>
                <option value="">{t.selectBank}</option>
                {banks.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>{t.accountNumber}</label>
              <input
                name="accountNumber" value={form.accountNumber}
                onChange={onChange} placeholder="xxx-x-xxxxx-x" style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>{t.accountName}</label>
              <input
                name="accountName" value={form.accountName}
                onChange={onChange} placeholder="John Doe" style={styles.input}
              />
            </div>

            <div style={styles.modalActions}>
              <button type="button" style={styles.cancelBtn} onClick={onClose}>{t.cancel}</button>
              <button
                type="submit"
                style={{ ...styles.submitBtn, ...(loading ? styles.btnDisabled : {}) }}
                disabled={loading}
              >
                {loading ? '...' : t.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  },
  modal: {
    background: '#1c1400', border: '1px solid #3d2e00',
    borderRadius: '20px', padding: '1.75rem',
    width: '100%', maxWidth: '460px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '1.25rem',
  },
  modalTitle: { fontSize: '1.25rem', fontWeight: 800, color: '#fcd34d' },
  closeBtn: {
    background: 'none', border: 'none', color: '#6b5a3e',
    fontSize: '1.1rem', cursor: 'pointer', padding: '0.25rem',
  },
  balanceInfo: {
    fontSize: '0.875rem', color: '#a8936a', marginBottom: '1.25rem',
    padding: '0.75rem 1rem', background: '#2a1f00',
    borderRadius: '10px', border: '1px solid #3d2e00',
  },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#fde68a', marginBottom: '0.4rem' },
  input: {
    width: '100%', padding: '0.75rem 0.875rem',
    background: '#2a1f00', border: '1.5px solid #3d2e00',
    borderRadius: '10px', color: '#fef3c7', fontSize: '0.95rem',
    fontFamily: 'inherit', outline: 'none',
  },
  errorBox: {
    background: '#3b0000', color: '#f87171', border: '1px solid #7f1d1d',
    borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  successBox: {
    background: '#052e16', color: '#4ade80', border: '1px solid #166534',
    borderRadius: '10px', padding: '1rem', fontSize: '0.95rem', fontWeight: 600,
  },
  modalActions: { display: 'flex', gap: '0.75rem', marginTop: '1.25rem' },
  cancelBtn: {
    flex: 1, padding: '0.875rem', background: 'transparent',
    border: '1.5px solid #3d2e00', borderRadius: '10px',
    color: '#a8936a', fontSize: '0.95rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  submitBtn: {
    flex: 2, padding: '0.875rem',
    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00', border: 'none', borderRadius: '10px',
    fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnDisabled: { opacity: 0.45, cursor: 'not-allowed' },
};