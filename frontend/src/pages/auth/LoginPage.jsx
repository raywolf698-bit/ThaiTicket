import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { shared } from '../../styles/theme';
import LangToggle from '../../styles/GlobalLangToggle';

const TEXT = {
  en: {
    title: 'Login',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    submit: 'Login',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    welcomeTitle: 'WELCOME\nBACK!',
    welcomeText: "Thailand's premier lottery platform. Buy tickets, check results, and claim your winnings.",
    errors: {
      email: 'Please enter your email',
      password: 'Please enter your password',
    },
  },
  th: {
    title: 'เข้าสู่ระบบ',
    email: 'อีเมล',
    emailPlaceholder: 'you@example.com',
    password: 'รหัสผ่าน',
    passwordPlaceholder: '••••••••',
    submit: 'เข้าสู่ระบบ',
    noAccount: 'ยังไม่มีบัญชี?',
    signUp: 'สมัครสมาชิก',
    welcomeTitle: 'ยินดี\nต้อนรับ!',
    welcomeText: 'แพลตฟอร์มสลากกินแบ่งรัฐบาลออนไลน์ ซื้อสลาก ตรวจผล และรับรางวัล',
    errors: {
      email: 'กรุณากรอกอีเมล',
      password: 'กรุณากรอกรหัสผ่าน',
    },
  },
};

export default function LoginPage() {
  const { login } = useAuth();
  const [lang, setLang] = useState('en');
  const t = TEXT[lang];
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const e = {};
    if (!form.email) e.email = t.errors.email;
    if (!form.password) e.password = t.errors.password;
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setServerError('');
    try {
      await login(form);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((ev) => ({ ...ev, [e.target.name]: '' }));
  }

  return (
    <div style={shared.authPage} data-auth-page>
      <LangToggle lang={lang} setLang={setLang} />

      <div style={shared.authLeft} data-auth-left>
        <div>
          <span style={shared.logo}>🎟</span>
          <h1 style={shared.welcomeTitle}>
            {t.welcomeTitle.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
          </h1>
          <p style={shared.welcomeText}>{t.welcomeText}</p>
        </div>
      </div>

      <div style={shared.authRight} data-auth-right>
        <div style={shared.formBox}>
          <h2 style={shared.formTitle}>{t.title}</h2>
          <div style={shared.titleUnderline} />

          {serverError && <div style={shared.errorBox}>{serverError}</div>}

          <form onSubmit={handleSubmit}>
            <div style={shared.field}>
              <label style={shared.label}>{t.email}</label>
              <div style={shared.inputWrap}>
                <span style={shared.inputIcon}>📧</span>
                <input name="email" type="email" placeholder={t.emailPlaceholder}
                  value={form.email} onChange={onChange} style={shared.input} />
              </div>
              {errors.email && <span style={shared.error}>{errors.email}</span>}
            </div>

            <div style={shared.field}>
              <label style={shared.label}>{t.password}</label>
              <div style={shared.inputWrap}>
                <span style={shared.inputIcon}>🔒</span>
                <input name="password" type="password" placeholder={t.passwordPlaceholder}
                  value={form.password} onChange={onChange} style={shared.input} />
              </div>
              {errors.password && <span style={shared.error}>{errors.password}</span>}
            </div>

            <button type="submit"
              style={{ ...shared.btn, ...(loading ? shared.btnDisabled : {}) }}
              disabled={loading}>
              {loading ? '...' : t.submit}
            </button>
          </form>

          <p style={shared.footer}>
            {t.noAccount}{' '}
            <Link to="/register" style={shared.link}>{t.signUp}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}