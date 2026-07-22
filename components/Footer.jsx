import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import logoImg from '../public/davilas_logo.png';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const intl = useIntl();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>

        <div className={styles.brand}>
          <Link href="/" className={styles.logo_container}>
            <Image src={logoImg} alt="Davilas Hair & Beauty" width={64} height={64} />
          </Link>
          <div>
            <p className={styles.brandName}>Davilas</p>
            <p className={styles.brandSub}>Hair &amp; Beauty</p>
          </div>
        </div>

        <div className={styles.col}>
          <h3><FormattedMessage id="footer.links.title" /></h3>
          <ul className={styles.linkList}>
            <li><Link href="/projects"><FormattedMessage id="projects" /></Link></li>
            <li><Link href="/booking"><FormattedMessage id="booking" /></Link></li>
            <li><Link href="/contact"><FormattedMessage id="contact" /></Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3><FormattedMessage id="footer.contact.title" /></h3>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              <span><FormattedMessage id="footer.contact.location" /></span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              <span>+1 613 710 07-54</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>✉</span>
              <span>davilasbarack@gmail.com</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>🕐</span>
              <span><FormattedMessage id="footer.contact.appointment" /></span>
            </div>
          </div>
        </div>

        <div className={styles.col}>
          <h3><FormattedMessage id="footer.subscribe.title" /></h3>
          {subscribed ? (
            <p style={{ fontSize: 13, color: 'var(--green)' }}>✓ <FormattedMessage id="footer.subscribe.success" /></p>
          ) : (
            <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
              <p className={styles.subscribeDesc}><FormattedMessage id="footer.subscribe.desc" /></p>
              <input
                className={styles.subscribeInput}
                type="email"
                placeholder={intl.formatMessage({ id: 'footer.subscribe.button' })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className={styles.subscribeBtn} type="submit">
                <FormattedMessage id="footer.subscribe.button" />
              </button>
            </form>
          )}
        </div>

      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          <FormattedMessage id="footer.copyright" values={{ year: new Date().getFullYear() }} />
        </p>
        <div className={styles.bottomLinks}>
          <Link href="/terms"><FormattedMessage id="footer.terms" /></Link>
          <Link href="/disclaimer"><FormattedMessage id="footer.disclaimer" /></Link>
          <Link href="/contact"><FormattedMessage id="contact" /></Link>
        </div>
      </div>
    </footer>
  );
}
