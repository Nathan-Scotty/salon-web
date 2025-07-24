import styles from './stylesheets/Banner.module.css'
import Link from 'next/link'

export default function Banner() {

    return <>
        <div className={styles.header}>
            <h1>FAQs</h1>
            <div className={styles.links}>
                <Link className={styles.link} href="/">Home</Link>
                <div className={styles.faq}>FAQs</div>
            </div>
        </div>
    </>
}