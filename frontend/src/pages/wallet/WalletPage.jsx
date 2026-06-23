import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import WithdrawModal from './WithdrawModal';
import { getWithdrawals } from '../../api/wallet.api';
import LineContact from '../../components/common/LineContact';
const TEXT = {
  en: {
    title: 'My Wallet',
    subtitle: 'Manage your balance',
    balance: 'Available Balance',
    topUp: '+ Top Up',
    withdraw: 'Withdraw',
    history: 'Transaction History',
    withdrawals: 'Withdrawal Requests',
    noHistory: 'No transactions yet',
    noWithdrawals: 'No withdrawal requests',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    types: {
      deposit: 'Deposit', withdrawal: 'Withdrawal', purchase: 'Ticket Purchase',
      refund: 'Refund', payout: 'Prize Payout', promptpay: 'PromptPay Top-up',
      wave: 'Wave Top-up', grabpay: 'GrabPay Top-up', usdt: 'USDT Top-up',
    },
  },
  th: {
    title: 'กระเป๋าเงิน',
    subtitle: 'จัดการยอดเงินของคุณ',
    balance: 'ยอดเงินคงเหลือ',
    topUp: '+ เติมเงิน',
    withdraw: 'ถอนเงิน',
    history: 'ประวัติการทำรายการ',
    withdrawals: 'คำขอถอนเงิน',
    noHistory: 'ยังไม่มีรายการ',
    noWithdrawals: 'ยังไม่มีคำขอถอนเงิน',
    pending: 'รอดำเนินการ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ปฏิเสธ',
    types: {
      deposit: 'เติมเงิน', withdrawal: 'ถอนเงิน', purchase: 'ซื้อสลาก',
      refund: 'คืนเงิน', payout: 'รับรางวัล', promptpay: 'เติมเงินผ่าน PromptPay',
      wave: 'เติมเงินผ่าน Wave', grabpay: 'เติมเงินผ่าน GrabPay', usdt: 'เติมเงินผ่าน USDT',
    },
  },
};

const BANKS = [
  'ธนาคารกรุงเทพ (BBL)',
  'ธนาคารกสิกรไทย (KBANK)',
  'ธนาคารไทยพาณิชย์ (SCB)',
  'ธนาคารกรุงไทย (KTB)',
  'ธนาคารกรุงศรีอยุธยา (BAY)',
  'ธนาคารทหารไทยธนชาต (TTB)',
  'ธนาคารออมสิน (GSB)',
  'KBank', 'SCB', 'Bangkok Bank', 'Kasikorn Bank', 'Other',
];

export default function WalletPage() {
  const { balance, history, loading, fetchWallet } = useWallet();
  const [lang, setLang] = useState('en');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showWithdrawals, setShowWithdrawals] = useState(false);
  const t = TEXT[lang];

  const isCredit = (type) => ['deposit', 'refund', 'payout', 'promptpay', 'wave', 'grabpay', 'usdt'].includes(type);

  const statusColor = {
    pending: { bg: '#2a1f00', color: '#fbbf24', border: '#3d2e00' },
    approved: { bg: '#052e16', color: '#4ade80', border: '#166534' },
    rejected: { bg: '#3b0000', color: '#f87171', border: '#7f1d1d' },
  };

  return (
    <div style={styles.page}>
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

      {/* Balance card */}
      <div style={styles.balanceCard}>
        <div style={styles.balanceGlow} />
        <span style={styles.balanceLabel}>{t.balance}</span>
        <span style={styles.balanceAmount}>
          ฿{loading ? '...' : balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div style={styles.balanceActions}>
          <Link to="/wallet/topup" style={styles.topUpBtn}>{t.topUp}</Link>
          <button style={styles.withdrawBtn} onClick={() => setShowWithdraw(true)}>{t.withdraw}</button>
        </div>
      </div>

      {/* Withdraw modal */}
      {showWithdraw && (
        <WithdrawModal
          balance={balance}
          banks={BANKS}
          lang={lang}
          onClose={() => setShowWithdraw(false)}
          onSuccess={() => { setShowWithdraw(false); fetchWallet(); }}
        />
      )}

      {/* Withdrawal requests */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{t.withdrawals}</h2>
        <button
          style={styles.toggleBtn}
          onClick={async () => {
            if (!showWithdrawals) {
              const res = await getWithdrawals();
              setWithdrawals(res.data);
            }
            setShowWithdrawals((v) => !v);
          }}
        >
          {showWithdrawals ? 'Hide' : 'Show'}
        </button>
      </div>

      {showWithdrawals && (
        <div style={styles.list}>
          {withdrawals.length === 0 ? (
            <p style={{ color: '#a8936a', padding: '1rem' }}>{t.noWithdrawals}</p>
          ) : withdrawals.map((w) => {
            const sc = statusColor[w.status];
            return (
              <div key={w.id} style={styles.row}>
                <div style={{ ...styles.iconWrap, background: sc.bg, color: sc.color }}>
                  ↑
                </div>
                <div style={styles.rowInfo}>
                  <span style={styles.rowType}>{w.bank_name} — {w.account_number}</span>
                  <span style={styles.rowDate}>{w.account_name} · {new Date(w.created_at).toLocaleDateString()}</span>
                  {w.admin_note && <span style={{ fontSize: '0.75rem', color: '#a8936a' }}>Note: {w.admin_note}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f87171' }}>
                    -฿{Number(w.amount).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {t[w.status]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction history */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '1.5rem' }}>{t.history}</h2>
      {loading ? (
        <div style={styles.center}><div style={styles.spinner} /></div>
      ) : history.length === 0 ? (
        <div style={styles.center}>
          <span style={styles.emptyIcon}>💳</span>
          <p style={styles.emptyText}>{t.noHistory}</p>
        </div>
      ) : (
        <div style={styles.list}>
          {history.map((tx) => {
            const credit = isCredit(tx.type);
            return (
              <div key={tx.id} style={styles.row}>
                <div style={{ ...styles.iconWrap, ...(credit ? styles.iconCredit : styles.iconDebit) }}>
                  {credit ? '↓' : '↑'}
                </div>
                <div style={styles.rowInfo}>
                  <span style={styles.rowType}>{t.types[tx.type] || tx.type}</span>
                  <span style={styles.rowDate}>
                    {new Date(tx.created_at).toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <span style={{ ...styles.rowAmount, color: credit ? '#4ade80' : '#f87171' }}>
                  {credit ? '+' : '-'}฿{Number(tx.amount).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <LineContact />
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif" },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
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
  balanceCard: {
    position: 'relative', background: 'linear-gradient(145deg, #1c1400, #2a1f00)',
    border: '1px solid #d97706', borderRadius: '24px',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '2rem',
    overflow: 'hidden', boxShadow: '0 8px 40px rgba(245,158,11,0.15)',
  },
  balanceGlow: {
    position: 'absolute', top: '-50%', right: '-20%',
    width: '300px', height: '300px',
    background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  balanceLabel: {
    display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#a8936a',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem',
  },
  balanceAmount: {
    display: 'block', fontSize: 'clamp(2.25rem, 6vw, 3.5rem)', fontWeight: 900,
    background: 'linear-gradient(135deg, #fcd34d, #f59e0b, #fbbf24)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', marginBottom: '1.5rem', letterSpacing: '-0.02em',
  },
  balanceActions: { display: 'flex', gap: '0.875rem', flexWrap: 'wrap' },
  topUpBtn: {
    padding: '0.8rem 1.75rem', background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00', border: 'none', borderRadius: '12px', fontSize: '0.95rem',
    fontWeight: 800, cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(245,158,11,0.35)', display: 'inline-flex', alignItems: 'center',
  },
  withdrawBtn: {
    padding: '0.8rem 1.75rem', background: 'transparent', color: '#fcd34d',
    border: '1.5px solid #3d2e00', borderRadius: '12px', fontSize: '0.95rem',
    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 800, color: '#fcd34d' },
  toggleBtn: {
    padding: '0.35rem 0.875rem', background: '#2a1f00', border: '1px solid #3d2e00',
    borderRadius: '8px', color: '#a8936a', fontSize: '0.8rem',
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '3rem 1rem', gap: '0.75rem',
  },
  spinner: {
    width: '32px', height: '32px', border: '3px solid #3d2e00',
    borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.65s linear infinite',
  },
  emptyIcon: { fontSize: '2.5rem' },
  emptyText: { color: '#a8936a', fontSize: '0.9rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' },
  row: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: '#1c1400', border: '1px solid #3d2e00',
    borderRadius: '14px', padding: '0.875rem 1.1rem',
  },
  iconWrap: {
    width: '40px', height: '40px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', fontWeight: 900, flexShrink: 0,
  },
  iconCredit: { background: '#052e16', color: '#4ade80' },
  iconDebit: { background: '#3b0000', color: '#f87171' },
  rowInfo: { display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1, minWidth: 0 },
  rowType: { fontSize: '0.95rem', fontWeight: 700, color: '#fef3c7' },
  rowDate: { fontSize: '0.75rem', color: '#6b5a3e' },
  rowAmount: { fontSize: '1rem', fontWeight: 800, flexShrink: 0, whiteSpace: 'nowrap' },
};