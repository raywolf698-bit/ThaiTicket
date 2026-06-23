export default function Button({ children, loading, variant = 'primary', ...props }) {
  return (
    <button
      className={`btn btn--${variant}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="btn-spinner" /> : children}
    </button>
  );
}