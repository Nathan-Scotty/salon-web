import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from '../styles/Contact.module.css';

export default function ContactPage() {
  const intl = useIntl();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}><FormattedMessage id="contact.eyebrow" /></p>
        <h1 className={styles.title}><FormattedMessage id="contact.title" /></h1>
        <p className={styles.subtitle}><FormattedMessage id="contact.sub" /></p>
        <div className={styles.divider}><span>✦</span></div>
      </div>

      <div className={styles.layout}>
        <div className={styles.info}>
          <h3><FormattedMessage id="contact.info.title" /></h3>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>📍</div>
            <div>
              <p className={styles.infoLabel}><FormattedMessage id="contact.info.address.label" /></p>
              <p className={styles.infoValue}><FormattedMessage id="contact.info.address.value" /></p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>📞</div>
            <div>
              <p className={styles.infoLabel}><FormattedMessage id="contact.info.phone.label" /></p>
              <p className={styles.infoValue}>+1 613 710 07-54</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>✉</div>
            <div>
              <p className={styles.infoLabel}><FormattedMessage id="contact.info.email.label" /></p>
              <p className={styles.infoValue}>davilasbarack@gmail.com</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>🕐</div>
            <div>
              <p className={styles.infoLabel}><FormattedMessage id="contact.info.hours.label" /></p>
              <p className={styles.infoValue}><FormattedMessage id="contact.info.hours.value" /></p>
            </div>
          </div>
        </div>

        <div className={styles.form}>
          {sent ? (
            <div className={styles.success}><FormattedMessage id="contact.form.success" /></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label}><FormattedMessage id="contact.form.name" /></label>
                <input className={styles.input} type="text" name="name" placeholder={intl.formatMessage({ id: 'contact.form.name.placeholder' })} value={form.name} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}><FormattedMessage id="contact.form.email" /></label>
                <input className={styles.input} type="email" name="email" placeholder={intl.formatMessage({ id: 'contact.form.email.placeholder' })} value={form.email} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}><FormattedMessage id="contact.form.phone" /></label>
                <input className={styles.input} type="tel" name="phone" placeholder={intl.formatMessage({ id: 'contact.form.phone.placeholder' })} value={form.phone} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}><FormattedMessage id="contact.form.message" /></label>
                <textarea className={styles.textarea} name="message" placeholder={intl.formatMessage({ id: 'contact.form.message.placeholder' })} value={form.message} onChange={handleChange} required />
              </div>
              <button className={styles.submitBtn} type="submit"><FormattedMessage id="contact.form.submit" /></button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
