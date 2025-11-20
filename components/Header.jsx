import Link from "next/link";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLocale } from "./LocaleProvider";
import { FormattedMessage } from "react-intl";

export default function Header() {
    const [locale, setLocale] = useLocale();
    const router = useRouter();

    const handleLocaleChange = (event) => {
        const newLocale = event.target.value;
        setLocale(newLocale);
        router.push(router.pathname, router.asPath, { locale: newLocale });
    };

    const [scrolled, setScrolled] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeLink, setActiveLink] = useState('/');

    useEffect(() => {
        const scrollFunction = () => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', scrollFunction);

        return () => {
            window.removeEventListener('scroll', scrollFunction);
        };
    }, []);

    useEffect(() => {
        setActiveLink(router.pathname);
    }, [router.pathname]);

    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };
    // FONCTION CLÉ : ferme le menu mobile quand on clique sur un lien
    const handleLinkClick = () => {
        setShowLinks(false);
    };

    const toggleLinks = () => {
        setShowLinks(!showLinks);
    };

    const getHeaderColorClass = () => {
        switch (router.pathname) {
            case '/about': return styles.aboutPage;
            case '/contact': return styles.contactPage;
            case '/faqs': return styles.faqsPage;
            case '/services': return styles.services;
            case '/booking': return styles.booking;
            case '/projects': return styles.projects;
            case '/admin': return styles.adminPage;
            default: return styles.defaultPage;
        }
    };

    return (
        <header>
            <div className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${getHeaderColorClass()}`}>
                <Link href="/" className={styles.logo_container}>
                    
                </Link>
                <div>
                    <div className={`${styles.menu_icon} ${showLinks ? styles.open : ''}`} onClick={toggleLinks}>
                        <FontAwesomeIcon icon={showLinks ? faTimes : faBars} />
                    </div>

                    <div className={`${styles.navbar_links} ${showLinks ? styles.show : ''}`}>
                        <Link className={`${styles.navbar_link} ${activeLink === '/' ? styles.active : ''}`} href="/" onClick={handleLinkClick}>
                            <FormattedMessage id="home" />
                        </Link>
                        <Link className={`${styles.navbar_link} ${activeLink === '/about' ? styles.active : ''}`} href="/about" onClick={handleLinkClick}>
                            <FormattedMessage id="about" />
                        </Link>
                        <Link className={`${styles.navbar_link} ${activeLink === '/projects' ? styles.active : ''}`} href="/projects" onClick={handleLinkClick}>
                            <FormattedMessage id="services" />
                        </Link>
                        <Link className={`${styles.navbar_link} ${activeLink === '/booking' ? styles.active : ''}`} href="/booking" onClick={handleLinkClick}>
                            <FormattedMessage id="booking" />
                        </Link>
                        <Link className={`${styles.navbar_link} ${activeLink === '/faqs' ? styles.active : ''}`} href="/faqs" onClick={handleLinkClick}>
                            <FormattedMessage id="faqs" />
                        </Link>
                        <Link className={`${styles.navbar_link} ${activeLink === '/contact' ? styles.active : ''}`} href="/contact" onClick={handleLinkClick}>
                            <FormattedMessage id="contact" />
                        </Link>
                    </div>
                </div>
                <label className={styles.label}>
                    Langue:
                    <select value={locale} onChange={handleLocaleChange}>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                    </select>
                </label>
            </div>
        </header>
    );
}
