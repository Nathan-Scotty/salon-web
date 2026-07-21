import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { auth, saveAuth } from '../../lib/api';
import styles from './stylesheets/Signin.module.css';

export default function Signin() {
  const router = useRouter();
  const intl = useIntl();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await auth.signin({ email, password });
      saveAuth(result.id, result.token);
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.inner}>
          <div className={styles.logoWrap}>
            <div className={styles.logoRing}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M12 2C8.5 2 5.5 4.5 5.5 8c0 2.5 1.5 4.5 3.5 5.5v2H15v-2c2-1 3.5-3 3.5-5.5C18.5 4.5 15.5 2 12 2z"/>
                <line x1="9" y1="21" x2="15" y2="21"/>
                <line x1="10" y1="18" x2="14" y2="18"/>
              </svg>
            </div>
            <h1 className={styles.salonName}><FormattedMessage id="signin.salonName" /></h1>
            <p className={styles.salonSub}><FormattedMessage id="signin.salonSub" /></p>
            <span className={styles.badge}><FormattedMessage id="signin.badge" /></span>
          </div>
          <div className={styles.divider}><span>✦</span></div>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}><FormattedMessage id="signin.email" /></label>
              <input className={styles.input} type="email" placeholder={intl.formatMessage({ id: 'signin.email.placeholder' })} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}><FormattedMessage id="signin.password" /></label>
              <input className={styles.input} type="password" placeholder={intl.formatMessage({ id: 'signin.password.placeholder' })} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? <FormattedMessage id="signin.loading" /> : <FormattedMessage id="signin.btn" />}
            </button>
          </form>
          <p className={styles.footer}>
            <FormattedMessage id="signin.footer" />
            <Link href="/signup"><FormattedMessage id="signin.footer.link" /></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
