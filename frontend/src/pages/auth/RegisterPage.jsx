import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { shared } from '../../styles/theme';
import LangToggle from '../../styles/GlobalLangToggle';

const COUNTRIES = {
  en: [
    { value: 'TH', label: '🇹🇭 Thailand' },
    { value: 'MM', label: '🇲🇲 Myanmar' },
    { value: 'LA', label: '🇱🇦 Laos' },
    { value: 'KH', label: '🇰🇭 Cambodia' },
    { value: 'OTHER', label: '🌏 Other' },
  ],
  th: [
    { value: 'TH', label: '🇹🇭 ไทย' },
    { value: 'MM', label: '🇲🇲 เมียนมา' },
    { value: 'LA', label: '🇱🇦 ลาว' },
    { value: 'KH', label: '🇰🇭 กัมพูชา' },
    { value: 'OTHER', label: '🌏 อื่นๆ' },
  ],
};

const TEXT = {
  en: {
    title: 'Create Account',
    name: 'Full Name', namePlaceholder: 'John Doe',
    email: 'Email', emailPlaceholder: 'you@example.com',
    country: 'Country',
    password: 'Password', passwordPlaceholder: 'At least 8 characters',
    confirmPassword: 'Confirm Password', confirmPlaceholder: '••••••••',
    submit: 'Sign Up',
    haveAccount: 'Already have an account?', login: 'Login',
    welcomeTitle: 'JOIN\nUS!',
    welcomeText: "Thailand's premier lottery platform. Buy tickets, check results, and claim your winnings.",
    errors: {
      name: 'Please enter your name',
      email: 'Please enter your email',
      password: 'Password must be at least 8 characters',
      confirmPassword: 'Passwords do not match',
    },
  },
  th: {
    title: 'สมัครสมาชิก',
    name: 'ชื่อ-นามสกุล', namePlaceholder: 'สมชาย ใจดี',
    email: 'อีเมล', emailPlaceholder: 'you@example.com',
    country: 'ประเทศ',
    password: 'รหัสผ่าน', passwordPlaceholder: 'อย่างน้อย 8 ตัวอักษร',
    confirmPassword: 'ยืนยันรหัสผ่าน', confirmPlaceholder: '••••••••',
    submit: 'สมัครสมาชิก',
    haveAccount: 'มีบัญชีแล้ว?', login: 'เข้าสู่ระบบ',
    welcomeTitle: 'เข้าร่วม\nกับเรา!',
    welcomeText: 'แพลตฟอร์มสลากกินแบ่งรัฐบาลออนไลน์ ซื้อสลาก ตรวจผล และรับรางวัล',
    errors: {
      name: 'กรุณากรอกชื่อ',
      email: 'กรุณากรอกอีเมล',
      password: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
      confirmPassword: 'รหัสผ่านไม่ตรงกัน',
    },
  },
};

export default function RegisterPage() {
  const { register } = useAuth();
  const [lang, setLang] = useState('en');
  const t = TEXT[lang];
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', country: 'TH' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const e = {};
    if (!form.name) e.name = t.errors.name;
    if (!form.email) e.email = t.errors.email;
    if (!form.password || form.password.length < 8) e.password = t.errors.password;
    if (form.password !== form.confirmPassword) e.confirmPassword = t.errors.confirmPassword;
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setServerError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password, country: form.country });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong');
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
              <label style={shared.label}>{t.name}</label>
              <div style={shared.inputWrap}>
                <span style={shared.inputIcon}>👤</span>
                <input name="name" placeholder={t.namePlaceholder} value={form.name} onChange={onChange} style={shared.input} />
              </div>
              {errors.name && <span style={shared.error}>{errors.name}</span>}
            </div>

            <div style={shared.field}>
              <label style={shared.label}>{t.email}</label>
              <div style={shared.inputWrap}>
                <span style={shared.inputIcon}>📧</span>
                <input name="email" type="email" placeholder={t.emailPlaceholder} value={form.email} onChange={onChange} style={shared.input} />
              </div>
              {errors.email && <span style={shared.error}>{errors.email}</span>}
            </div>

            <div style={shared.field}>
              <label style={shared.label}>{t.country}</label>
              <select name="country" value={form.country} onChange={onChange} style={shared.select}>
                {COUNTRIES[lang].map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div style={shared.field}>
              <label style={shared.label}>{t.password}</label>
              <div style={shared.inputWrap}>
                <span style={shared.inputIcon}>🔒</span>
                <input name="password" type="password" placeholder={t.passwordPlaceholder} value={form.password} onChange={onChange} style={shared.input} />
              </div>
              {errors.password && <span style={shared.error}>{errors.password}</span>}
            </div>

            <div style={shared.field}>
              <label style={shared.label}>{t.confirmPassword}</label>
              <div style={shared.inputWrap}>
                <span style={shared.inputIcon}>🔒</span>
                <input name="confirmPassword" type="password" placeholder={t.confirmPlaceholder} value={form.confirmPassword} onChange={onChange} style={shared.input} />
              </div>
              {errors.confirmPassword && <span style={shared.error}>{errors.confirmPassword}</span>}
            </div>

            <button type="submit"
              style={{ ...shared.btn, ...(loading ? shared.btnDisabled : {}) }}
              disabled={loading}>
              {loading ? '...' : t.submit}
            </button>
          </form>

          <p style={shared.footer}>
            {t.haveAccount}{' '}
            <Link to="/login" style={shared.link}>{t.login}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}