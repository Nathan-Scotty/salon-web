import { FormattedMessage } from 'react-intl'
import styles from './stylesheets/Banner.module.css'
import Link from 'next/link'

export default function Banner() {

    return <>
        <div className={styles.header}>
            <h1>Services</h1>
            <div className={styles.links}>
                <Link className={styles.link} href="/"><FormattedMessage id='home'/></Link>
                <div className={styles.service}><FormattedMessage id='service'/></div>
            </div>
        </div>
    </>
}