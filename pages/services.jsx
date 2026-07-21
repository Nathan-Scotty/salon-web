import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useIntl, FormattedMessage } from 'react-intl';
import { services as servicesApi } from '../lib/api';
import styles from '../styles/Services.module.css';

export default function ServicesPage() {
  const intl = useIntl();
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesApi.getAll(true).then(setServiceList).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}><FormattedMessage id="services.eyebrow" /></p>
        <h1 className={styles.title}><FormattedMessage id="services.title" /></h1>
        <p className={styles.subtitle}><FormattedMessage id="services.sub" /></p>
        <div className={styles.divider}><span>✦</span></div>
      </div>

      {loading && <p className={styles.loading}><FormattedMessage id="services.loading" /></p>}
      {!loading && serviceList.length === 0 && <p className={styles.empty}><FormattedMessage id="services.empty" /></p>}

      {!loading && serviceList.length > 0 && (
        <div className={styles.grid}>
          {serviceList.map((s) => (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h2 className={styles.serviceName}>{s.name}</h2>
                <span className={styles.price}>${Number(s.price).toFixed(2)}</span>
              </div>
              <p className={styles.duration}>{s.durationMin} <FormattedMessage id="services.duration" values={{ min: '' }} /></p>
              {s.description && <p className={styles.description}>{s.description}</p>}
              <Link href="/booking" className={styles.bookBtn}><FormattedMessage id="services.bookBtn" /></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
