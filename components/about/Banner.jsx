import styles from './stylesheets/Banner.module.css'
import Link from 'next/link'

export default function Banner() {

    return <>
        <div className={styles.header}>
            <h1>About</h1>
            <div className={styles.links}>
                <Link className={styles.link} href="/">Home</Link>
                <div className={styles.about}>About</div>
            </div>
        </div>
    </>
}