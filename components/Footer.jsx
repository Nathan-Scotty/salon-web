import styles from "../styles/Footer.module.css"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {

    return (
        <footer className={styles.footer}>
            <Link href="/" className={styles.logo_container}>
                
            </Link>
            <div className={styles.footer_links}>
                <h1>USEFUL LINKS</h1>
                <ul>
                    <li><Link href="#" className={styles.footer_useful}>Privacy Policy</Link></li>
                    <li><Link href="#" className={styles.footer_useful}>Terms & Conditions</Link></li>
                    <li><Link href="#" className={styles.footer_useful}>Disclaimer</Link></li>
                </ul>
            </div>
            <div className={styles.footer_contacts}>
                <h1>CONTACTS</h1>
                <p>Monday to Friday 9:00am - 6:00pm</p>
                <p>Ottawa, Canada</p>
                <p>+880123456789</p>
                <p>example@mail.com</p>
            </div>
            <div className={styles.footer_subscribe}>
                <h1>SUBSCRIBE US</h1>
                <form>
                    <input type="email" placeholder="Email Address" />
                    <button type="submit">SUBSCRIBE</button>
                </form>
            </div>
            <div className={styles.copyright}>
                <p>© 2024 - Nathan Musoko - Developer and Designer</p>
            </div>
        </footer>

    )
}