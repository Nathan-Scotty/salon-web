import styles from './stylesheets/Banner.module.css'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

export default function Banner() {

    return <>
        <div className={styles.header}>
            <h1><FormattedMessage id='booking'/></h1>
            <div className={styles.links}>
                <Link className={styles.link} href="/"><FormattedMessage id='home'/></Link>
                <div className={styles.booking}><FormattedMessage id='booking'/></div>
            </div>
        </div>
    </>
}