import styles from './stylesheets/Banner.module.css'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

export default function Banner() {

    return <>
        <div className={styles.header}>
            <h1><FormattedMessage id='about'/></h1>
            <div className={styles.links}>
                <Link className={styles.link} href="/"><FormattedMessage id='home'/></Link>
                <div className={styles.about}><FormattedMessage id='about'/></div>
            </div>
        </div>
    </>
}