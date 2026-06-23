import { shared } from './theme';

export default function LangToggle({ lang, setLang }) {
  return (
    <div style={shared.langToggle}>
      <button
        style={{ ...shared.langBtn, ...(lang === 'en' ? shared.langBtnActive : {}) }}
        onClick={() => setLang('en')}
      >EN</button>
      <button
        style={{ ...shared.langBtn, ...(lang === 'th' ? shared.langBtnActive : {}) }}
        onClick={() => setLang('th')}
      >TH</button>
    </div>
  );
}