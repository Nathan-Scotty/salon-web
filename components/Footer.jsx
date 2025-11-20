import styles from "../styles/Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import logoImg from '../public/davilas_logo.png';
import { FormattedMessage } from "react-intl";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Link href="/" className={styles.logo_container}>
                <Image src={logoImg} alt="Davilas Hair & Beauty Logo" width={85} height={85} />
            </Link>

            {/* USEFUL LINKS */}
            <div className={styles.footer_links}>
                <h1>
                    <FormattedMessage id="footer.links.title" defaultMessage="USEFUL LINKS" />
                </h1>
                <ul>
                    <li>
                        <Link href="/booking" className={styles.footer_useful}>
                            <FormattedMessage
                                id="footer.links.booking"
                                defaultMessage="Click Here To Make An Appointment"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href="/terms" className={styles.footer_useful}>
                            <FormattedMessage
                                id="footer.links.terms"
                                defaultMessage="Terms & Conditions"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href="/disclaimer" className={styles.footer_useful}>
                            <FormattedMessage
                                id="footer.links.disclaimer"
                                defaultMessage="Disclaimer"
                            />
                        </Link>
                    </li>
                </ul>
            </div>

            {/* CONTACT INFO */}
            <div className={styles.footer_contacts}>
                <h1>
                    <FormattedMessage id="footer.contact.title" defaultMessage="CONTACTS" />
                </h1>
                <p>
                    <FormattedMessage
                        id="footer.contact.appointment"
                        defaultMessage="By appointment only"
                    />
                </p>
                <p>
                    <FormattedMessage
                        id="footer.contact.location"
                        defaultMessage="Gatineau-Ottawa, Canada"
                    />
                </p>
                <p>+880 123 456 789</p>
                <p>example@mail.com</p>
            </div>

            {/* SUBSCRIBE */}
            <div className={styles.footer_subscribe}>
                <h1>
                    <FormattedMessage id="footer.subscribe.title" defaultMessage="SUBSCRIBE US" />
                </h1>
                <form>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        aria-label="Email for subscription"
                    />
                    <button type="submit">
                        <FormattedMessage
                            id="footer.subscribe.button"
                            defaultMessage="SUBSCRIBE"
                        />
                    </button>
                </form>
            </div>

            {/* COPYRIGHT */}
            <div className={styles.copyright}>
                <p>
                    <FormattedMessage
                        id="footer.copyright"
                        defaultMessage="© 2025 - Nathan Musoko - Developer and Designer"
                        values={{ year: new Date().getFullYear() }}
                    />
                </p>
            </div>
        </footer>
    );
}