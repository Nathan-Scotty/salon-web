import { useState, useEffect, useCallback } from 'react';
import { createContext, useContext } from 'react';

// ─── Context ──────────────────────────────────────────────
const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

// ─── Provider ─────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error'), info: (msg) => addToast(msg, 'info') }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 9999,
        maxWidth: '360px',
        width: '100%',
      }}>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Single Toast ──────────────────────────────────────────
function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    success: { bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)',  icon: '✓', iconColor: '#4ade80' },
    error:   { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', icon: '✕', iconColor: '#f87171' },
    info:    { bg: 'rgba(212,175,55,0.1)',  border: 'rgba(212,175,55,0.25)',  icon: '✦', iconColor: '#d4af37' },
  };

  const c = colors[toast.type] || colors.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        background: '#1a1a1a',
        border: `1px solid ${c.border}`,
        borderLeft: `3px solid ${c.iconColor}`,
        borderRadius: '4px',
        padding: '0.9rem 1rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        fontFamily: 'DM Sans, sans-serif',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
      }}
    >
      <span style={{ color: c.iconColor, fontSize: '14px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>
        {c.icon}
      </span>
      <p style={{ margin: 0, fontSize: '13px', color: '#f0ece4', lineHeight: 1.5, flex: 1 }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#888',
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1,
          padding: 0,
          flexShrink: 0,
          marginTop: '-1px',
        }}
      >
        ×
      </button>
    </div>
  );
}
