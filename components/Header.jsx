import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLocale } from './LocaleProvider';
import { FormattedMessage } from 'react-intl';
import logoImg from '../public/davilas_logo.png';
import styles from '../styles/Header.module.css';

const SOLID_PAGES = ['/about', '/contact', '/faqs', '/services', '/booking', '/projects'];

export default function Header() {
  const [locale, setLocale] = useLocale();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const isSolid = SOLID_PAGES.includes(router.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setShowLinks(false);
  }, [router.pathname]);

  const handleLocaleChange = (e) => {
    const newLocale = e.target.value;
    setLocale(newLocale);
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  const isActive = (path) => router.pathname === path;

  return (
    <header>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${isSolid ? styles.solidBg : ''}`}>

        {/* Logo */}
        <Link href="/" className={styles.logo_container}>
          <Image src={logoImg} alt="Davilas Hair & Beauty" width={52} height={52} />
        </Link>

        {/* Desktop nav */}
        <div className={`${styles.navbar_links} ${showLinks ? styles.show : ''}`}>
          {[
            { href: '/',        id: 'home' },
            { href: '/about',   id: 'about' },
            { href: '/projects', id: 'services' },
            { href: '/booking', id: 'booking' },
            { href: '/faqs',    id: 'faqs' },
            { href: '/contact', id: 'contact' },
          ].map(({ href, id }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navbar_link} ${isActive(href) ? styles.active : ''}`}
            >
              <FormattedMessage id={id} />
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className={styles.right}>
          <div className={styles.localeWrap}>
            <span className={styles.localeLabel}>Lang</span>
            <select className={styles.localeSelect} value={locale} onChange={handleLocaleChange}>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          <Link href="/booking" className={styles.bookBtn}><FormattedMessage id="home.cta.btn" /></Link>

          {/* Mobile toggle */}
          <div className={styles.menu_icon} onClick={() => setShowLinks(!showLinks)}>
            <FontAwesomeIcon icon={showLinks ? faTimes : faBars} />
          </div>
        </div>

      </nav>
    </header>
  );
}
