import { useState } from 'react';
import Link from 'next/link';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from '../styles/Faqs.module.css';

const FAQ_KEYS = [
  { q: 'faqs.q1', a: 'faqs.a1' },
  { q: 'faqs.q2', a: 'faqs.a2' },
  { q: 'faqs.q3', a: 'faqs.a3' },
  { q: 'faqs.q4', a: 'faqs.a4' },
  { q: 'faqs.q5', a: 'faqs.a5' },
  { q: 'faqs.q6', a: 'faqs.a6' },
  { q: 'faqs.q7', a: 'faqs.a7' },
  { q: 'faqs.q8', a: 'faqs.a8' },
];

export default function FaqsPage() {
  const intl = useIntl();
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}><FormattedMessage id="faqs.eyebrow" /></p>
        <h1 className={styles.title}><FormattedMessage id="faqs.title" /></h1>
        <p className={styles.subtitle}><FormattedMessage id="faqs.sub" /></p>
        <div className={styles.divider}><span>✦</span></div>
      </div>

      <div className={styles.list}>
        {FAQ_KEYS.map((faq, i) => (
          <div key={i} className={`${styles.item} ${openIndex === i ? styles.open : ''}`}>
            <button className={styles.question} onClick={() => toggle(i)}>
              <span className={styles.questionText}><FormattedMessage id={faq.q} /></span>
              <span className={styles.icon}>+</span>
            </button>
            {openIndex === i && (
              <div className={styles.answer}><FormattedMessage id={faq.a} /></div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}><FormattedMessage id="faqs.cta.title" /></h2>
        <p className={styles.ctaSub}><FormattedMessage id="faqs.cta.sub" /></p>
        <Link href="/contact" className={styles.ctaBtn}><FormattedMessage id="faqs.cta.btn" /></Link>
      </div>
    </div>
  );
}
