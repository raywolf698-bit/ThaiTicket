import { useState, useEffect } from 'react';
import client from '../../api/client';

const TEXT = {
  en: {
    title: 'Draw Results',
    subtitle: 'Check the latest winning numbers',
    check: 'Check My Ticket',
    ticketNumber: 'Enter ticket number...',
    winner: '🎉 Congratulations!',
    notWinner: '😔 Sorry, this ticket did not win.',
    noResults: 'No results available yet',
    drawDate: 'Draw Date',
    firstPrize: '1st Prize',
    adjacent: 'Adjacent 1st Prize',
    secondPrize: '2nd Prize',
    thirdPrize: '3rd Prize',
    fourthPrize: '4th Prize',
    fifthPrize: '5th Prize',
    front3: 'Front 3 Digits',
    last3: 'Last 3 Digits',
    last2: 'Last 2 Digits',
  },
  th: {
    title: 'ผลรางวัล',
    subtitle: 'ตรวจสอบผลรางวัลล่าสุด',
    check: 'ตรวจสลาก',
    ticketNumber: 'กรอกหมายเลขสลาก...',
    winner: '🎉 ยินดีด้วย!',
    notWinner: '😔 เสียใจด้วย สลากใบนี้ไม่ถูกรางวัล',
    noResults: 'ยังไม่มีผลรางวัล',
    drawDate: 'งวดวันที่',
    firstPrize: 'รางวัลที่ 1',
    adjacent: 'รางวัลข้างเคียง',
    secondPrize: 'รางวัลที่ 2',
    thirdPrize: 'รางวัลที่ 3',
    fourthPrize: 'รางวัลที่ 4',
    fifthPrize: 'รางวัลที่ 5',
    front3: '3 ตัวหน้า',
    last3: '3 ตัวท้าย',
    last2: '2 ตัวท้าย',
  },
};

export default function ResultsPage() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketInput, setTicketInput] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [lang, setLang] = useState('en');
  const t = TEXT[lang];

  useEffect(() => {
    client.get('/tickets/draws')
      .then((res) => setDraws(res.data || []))
      .catch(() => setDraws([]))
      .finally(() => setLoading(false));
  }, []);

  function checkTicket() {
    if (!ticketInput || !draws.length) return;
    const n = draws[0].winning_numbers;
    const input = ticketInput.trim();

    if (input === n.first_prize) {
      setCheckResult({ type: 'win', prize: '🥇 1st Prize — ฿6,000,000!' });
    } else if (n.adjacent?.includes(input)) {
      setCheckResult({ type: 'win', prize: '🎖 Adjacent 1st Prize — ฿100,000!' });
    } else if (n.second_prize?.includes(input)) {
      setCheckResult({ type: 'win', prize: '🥈 2nd Prize — ฿200,000!' });
    } else if (n.third_prize?.includes(input)) {
      setCheckResult({ type: 'win', prize: '🥉 3rd Prize — ฿80,000!' });
    } else if (n.fourth_prize?.includes(input)) {
      setCheckResult({ type: 'win', prize: '4th Prize — ฿40,000!' });
    } else if (n.fifth_prize?.includes(input)) {
      setCheckResult({ type: 'win', prize: '5th Prize — ฿20,000!' });
    } else if (n.front3?.includes(input.slice(0, 3))) {
      setCheckResult({ type: 'win', prize: '🎯 Front 3 Digits — ฿4,000!' });
    } else if (n.last3?.includes(input.slice(-3))) {
      setCheckResult({ type: 'win', prize: '🎯 Last 3 Digits — ฿4,000!' });
    } else if (n.last2?.includes(input.slice(-2))) {
      setCheckResult({ type: 'win', prize: '🎯 Last 2 Digits — ฿2,000!' });
    } else {
      setCheckResult({ type: 'lose', prize: null });
    }
  }

  const latestDraw = draws[0];

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

      {/* Ticket checker */}
      <div style={styles.checkerCard}>
        <div style={styles.checkerRow}>
          <input
            style={styles.checkerInput}
            placeholder={t.ticketNumber}
            value={ticketInput}
            onChange={(e) => { setTicketInput(e.target.value); setCheckResult(null); }}
            maxLength={6}
          />
          <button style={styles.checkBtn} onClick={checkTicket}>{t.check}</button>
        </div>
        {checkResult && (
          <div style={{ ...styles.checkResult, ...(checkResult.type === 'win' ? styles.checkWin : styles.checkLose) }}>
            {checkResult.type === 'win'
              ? `${t.winner} ${checkResult.prize}`
              : t.notWinner}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div style={styles.center}><div style={styles.spinner} /></div>
      ) : !latestDraw ? (
        <div style={styles.center}>
          <span style={{ fontSize: '2.5rem' }}>🏆</span>
          <p style={{ color: '#a8936a' }}>{t.noResults}</p>
        </div>
      ) : (
        draws.map((draw) => {
          const nums = draw.winning_numbers;
          return (
            <div key={draw.id} style={styles.drawCard}>
              {/* Draw date header */}
              <div style={styles.drawHeader}>
                <div>
                  <span style={styles.drawDateLabel}>{t.drawDate}</span>
                  <span style={styles.drawDate}>
                    {new Date(draw.draw_date).toLocaleDateString(
                      lang === 'th' ? 'th-TH' : 'en-US',
                      { day: 'numeric', month: 'long', year: 'numeric' }
                    )}
                  </span>
                </div>
                <span style={styles.announcedBadge}>
                  {new Date(draw.announced_at).toLocaleDateString()}
                </span>
              </div>

              {/* 1st Prize */}
              <div style={styles.firstPrizeBox}>
                <span style={styles.firstPrizeLabel}>{t.firstPrize} — ฿6,000,000</span>
                <span style={styles.firstPrizeNumber}>{nums.first_prize || '-'}</span>
                {nums.adjacent?.length > 0 && (
                  <div style={styles.adjacentRow}>
                    <span style={styles.adjacentLabel}>{t.adjacent} (฿100,000): </span>
                    {nums.adjacent.map((n, i) => (
                      <span key={i} style={styles.prizeNumber}>{n}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Other prizes */}
              <div style={styles.prizesGrid}>
                {nums.second_prize?.length > 0 && (
                  <div style={styles.prizeGroup}>
                    <span style={styles.prizeLabel}>{t.secondPrize} — ฿200,000</span>
                    <div style={styles.numberRow}>
                      {nums.second_prize.map((n, i) => <span key={i} style={styles.prizeNumber}>{n}</span>)}
                    </div>
                  </div>
                )}
                {nums.third_prize?.length > 0 && (
                  <div style={styles.prizeGroup}>
                    <span style={styles.prizeLabel}>{t.thirdPrize} — ฿80,000</span>
                    <div style={styles.numberRow}>
                      {nums.third_prize.map((n, i) => <span key={i} style={styles.prizeNumber}>{n}</span>)}
                    </div>
                  </div>
                )}
                {nums.fourth_prize?.length > 0 && (
                  <div style={styles.prizeGroup}>
                    <span style={styles.prizeLabel}>{t.fourthPrize} — ฿40,000</span>
                    <div style={styles.numberRow}>
                      {nums.fourth_prize.map((n, i) => <span key={i} style={styles.prizeNumber}>{n}</span>)}
                    </div>
                  </div>
                )}
                {nums.fifth_prize?.length > 0 && (
                  <div style={styles.prizeGroup}>
                    <span style={styles.prizeLabel}>{t.fifthPrize} — ฿20,000</span>
                    <div style={styles.numberRow}>
                      {nums.fifth_prize.map((n, i) => <span key={i} style={styles.prizeNumber}>{n}</span>)}
                    </div>
                  </div>
                )}
                <div style={styles.prizeGroup}>
                  <span style={styles.prizeLabel}>{t.front3} — ฿4,000</span>
                  <div style={styles.numberRow}>
                    {(nums.front3 || []).map((n, i) => <span key={i} style={styles.prizeNumber}>{n}</span>)}
                  </div>
                </div>
                <div style={styles.prizeGroup}>
                  <span style={styles.prizeLabel}>{t.last3} — ฿4,000</span>
                  <div style={styles.numberRow}>
                    {(nums.last3 || []).map((n, i) => <span key={i} style={styles.prizeNumber}>{n}</span>)}
                  </div>
                </div>
                <div style={styles.prizeGroup}>
                  <span style={styles.prizeLabel}>{t.last2} — ฿2,000</span>
                  <div style={styles.numberRow}>
                    {(nums.last2 || []).map((n, i) => <span key={i} style={styles.prizeNumber}>{n}</span>)}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
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
  checkerCard: {
    background: '#1c1400', border: '1px solid #3d2e00',
    borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem',
  },
  checkerRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  checkerInput: {
    flex: 1, minWidth: '180px', padding: '0.875rem 1rem',
    background: '#2a1f00', border: '1.5px solid #3d2e00', borderRadius: '12px',
    color: '#fef3c7', fontSize: '1.25rem', fontWeight: 700,
    fontFamily: 'monospace', outline: 'none', letterSpacing: '0.1em',
  },
  checkBtn: {
    padding: '0.875rem 1.75rem',
    background: 'linear-gradient(135deg, #d97706, #fbbf24)',
    color: '#0f0a00', border: 'none', borderRadius: '12px',
    fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
  },
  checkResult: {
    marginTop: '1rem', padding: '0.875rem 1rem',
    borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem',
  },
  checkWin: { background: '#052e16', color: '#4ade80', border: '1px solid #166534' },
  checkLose: { background: '#3b0000', color: '#f87171', border: '1px solid #7f1d1d' },
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '4rem 1rem', gap: '0.75rem',
  },
  spinner: {
    width: '32px', height: '32px', border: '3px solid #3d2e00',
    borderTopColor: '#f59e0b', borderRadius: '50%',
    animation: 'spin 0.65s linear infinite',
  },
  drawCard: {
    background: '#1c1400', border: '1px solid #3d2e00',
    borderRadius: '20px', padding: '1.5rem', marginBottom: '1.25rem',
  },
  drawHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem',
  },
  drawDateLabel: {
    display: 'block', fontSize: '0.75rem', color: '#6b5a3e',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem',
  },
  drawDate: { fontSize: '1.1rem', fontWeight: 700, color: '#fef3c7' },
  announcedBadge: {
    background: '#2a1f00', border: '1px solid #3d2e00',
    borderRadius: '8px', padding: '0.3rem 0.75rem',
    fontSize: '0.75rem', color: '#a8936a',
  },
  firstPrizeBox: {
    background: 'linear-gradient(145deg, #2a1f00, #3d2e00)',
    border: '1px solid #d97706', borderRadius: '16px', padding: '1.5rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.5rem', marginBottom: '1.25rem',
    boxShadow: '0 4px 20px rgba(245,158,11,0.15)',
  },
  firstPrizeLabel: {
    fontSize: '0.8rem', fontWeight: 700, color: '#a8936a',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  firstPrizeNumber: {
    fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900,
    background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', letterSpacing: '0.25em', fontFamily: 'monospace',
  },
  adjacentRow: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.25rem',
  },
  adjacentLabel: { fontSize: '0.75rem', color: '#6b5a3e' },
  prizesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  prizeGroup: {
    background: '#2a1f00', borderRadius: '12px', padding: '1rem',
    display: 'flex', flexDirection: 'column', gap: '0.625rem',
  },
  prizeLabel: {
    fontSize: '0.72rem', fontWeight: 700, color: '#a8936a',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  numberRow: { display: 'flex', flexWrap: 'wrap', gap: '0.35rem' },
  prizeNumber: {
    background: '#3d2e00', color: '#fcd34d',
    padding: '0.3rem 0.6rem', borderRadius: '6px',
    fontSize: '0.875rem', fontWeight: 700, fontFamily: 'monospace',
  },
};