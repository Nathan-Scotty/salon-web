import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { auth, saveAuth } from '../../lib/api';
import styles from './stylesheets/Signup.module.css';

export default function Signup() {
  const router = useRouter();
  const intl = useIntl();
  const [form, setForm] = useState({ name: '', email: '', passwordHash: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await auth.signup({ ...form, role: 'CLIENT' });
      saveAuth(result.id, result.token);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
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
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <h1 className={styles.salonName}><FormattedMessage id="signup.salonName" /></h1>
            <p className={styles.salonSub}><FormattedMessage id="signup.salonSub" /></p>
          </div>
          <div className={styles.divider}><span>✦</span></div>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}><FormattedMessage id="signup.name" /></label>
              <input className={styles.input} type="text" name="name" placeholder={intl.formatMessage({ id: 'signup.name.placeholder' })} value={form.name} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}><FormattedMessage id="signup.email" /></label>
              <input className={styles.input} type="email" name="email" placeholder={intl.formatMessage({ id: 'signup.email.placeholder' })} value={form.email} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}><FormattedMessage id="signup.password" /></label>
              <input className={styles.input} type="password" name="passwordHash" placeholder={intl.formatMessage({ id: 'signup.password.placeholder' })} value={form.passwordHash} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}><FormattedMessage id="signup.phone" /></label>
              <input className={styles.input} type="tel" name="phone" placeholder={intl.formatMessage({ id: 'signup.phone.placeholder' })} value={form.phone} onChange={handleChange} />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? <FormattedMessage id="signup.loading" /> : <FormattedMessage id="signup.btn" />}
            </button>
          </form>
          <p className={styles.footer}>
            <FormattedMessage id="signup.footer" />
            <Link href="/signin"><FormattedMessage id="signup.footer.link" /></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
