import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { shared, colors } from '../../styles/theme';
import LangToggle from '../../styles/GlobalLangToggle';

const TEXT = {
  en: {
    title: 'Verify OTP',
    welcomeTitle: 'SECURE\nLOGIN!',
    welcomeText: 'We sent a one-time password to your phone to keep your account safe.',
    subtitle: 'Enter the 6-digit code sent to',
    submit: 'Verify',
    resendIn: 'Resend code in',
    resend: 'Resend Code',
    seconds: 'seconds',
    error: 'Invalid or expired OTP code',
  },
  th: {
    title: 'ยืนยัน OTP',
    welcomeTitle: 'ความ\nปลอดภัย!',
    welcomeText: 'เราส่งรหัสผ่านครั้งเดียวไปยังโทรศัพท์ของคุณเพื่อรักษาความปลอดภัยบัญชี',
    subtitle: 'กรอกรหัส 6 หลักที่ส่งไปยัง',
    submit: 'ยืนยัน',
    resendIn: 'ส่งรหัสใหม่ได้ใน',
    resend: 'ส่งรหัสใหม่',
    seconds: 'วินาที',
    error: 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ',
  },
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyOtpPage() {
  const { verifyOtp } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const t = TEXT[lang];

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!state?.phone) navigate('/login', { replace: true });
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function handleDigitChange(index, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setDigits(pasted.split(''));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) return;
    setLoading(true);
    setServerError('');
    try {
      await verifyOtp({ phone: state.phone, otp, token: state.token });
    } catch (err) {
      setServerError(err.response?.data?.message || t.error);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  const otpComplete = digits.join('').length === OTP_LENGTH;

  return (
    <div style={shared.authPage} data-auth-page>
      <LangToggle lang={lang} setLang={setLang} />

      {/* Left */}
      <div style={shared.authLeft} data-auth-left>
        <div>
          <span style={shared.logo}>🔐</span>
          <h1 style={shared.welcomeTitle}>
            {t.welcomeTitle.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
          </h1>
          <p style={shared.welcomeText}>{t.welcomeText}</p>
        </div>
      </div>

      {/* Right */}
      <div style={shared.authRight} data-auth-right>
        <div style={shared.formBox}>
          <h2 style={shared.formTitle}>{t.title}</h2>
          <div style={shared.titleUnderline} />

          <p style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            {t.subtitle}<br />
            <strong style={{ color: colors.gold400 }}>{state?.phone}</strong>
          </p>

          {serverError && <div style={shared.errorBox}>{serverError}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '2rem' }} onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  data-otp-input
                  style={{
                    width: '52px', height: '60px',
                    textAlign: 'center',
                    fontSize: '1.5rem', fontWeight: 800,
                    background: colors.dark600,
                    border: `2px solid ${d ? colors.gold500 : colors.dark500}`,
                    borderRadius: '10px',
                    color: colors.textPrimary,
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxShadow: d ? `0 0 12px rgba(245,158,11,0.2)` : 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              style={{ ...shared.btn, ...(!otpComplete || loading ? shared.btnDisabled : {}) }}
              disabled={!otpComplete || loading}
            >
              {loading ? '...' : t.submit}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            {countdown > 0 ? (
              <span style={{ color: colors.textSubtle, fontSize: '0.9rem' }}>
                {t.resendIn} {countdown} {t.seconds}
              </span>
            ) : (
              <button
                style={{ background: 'none', border: 'none', color: colors.gold400, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}
                onClick={() => setCountdown(RESEND_SECONDS)}
              >
                {t.resend}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}