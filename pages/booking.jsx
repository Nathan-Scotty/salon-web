import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FormattedMessage, useIntl } from 'react-intl';
import { services as servicesApi, stylists as stylistsApi, availability as availApi } from '../lib/api';
import { useToast } from '../components/Toast';
import styles from '../styles/Booking.module.css';

const STEP_IDS = [
  'booking.step.info',
  'booking.step.service',
  'booking.step.stylist',
  'booking.step.slot',
  'booking.step.confirm',
];

export default function BookingPage() {
  const toast = useToast();
  const intl  = useIntl();

  const [step, setStep]               = useState(0);
  const [serviceList, setServiceList] = useState([]);
  const [stylistList, setStylistList] = useState([]);
  const [slotList, setSlotList]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState(false);

  const [info, setInfo]       = useState({ name: '', email: '', phone: '' });
  const [selected, setSelected] = useState({ service: null, stylist: null, slot: null });

  useEffect(() => {
    setLoading(true);
    Promise.all([servicesApi.getAll(true), stylistsApi.getAll()])
      .then(([s, st]) => { setServiceList(s); setStylistList(st); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (step === 3 && selected.stylist) {
      setLoading(true);
      availApi.getAll(selected.stylist.id, true)
        .then(setSlotList).catch(console.error).finally(() => setLoading(false));
    }
  }, [step, selected.stylist]);

  const formatSlotDate = (slot) =>
    new Date(slot.date).toLocaleDateString(intl.locale, { weekday: 'short', month: 'short', day: 'numeric' });

  const formatTime = (timeStr) =>
    new Date(timeStr).toLocaleTimeString(intl.locale, { hour: '2-digit', minute: '2-digit' });

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!info.name || !info.email) return;
    setStep(1);
  };

  const handleConfirm = async () => {
    setSubmitting(true); setError('');
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${BASE_URL}/appointments/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:           info.name,
          email:          info.email,
          phone:          info.phone,
          stylistId:      selected.stylist.id,
          availabilityId: selected.slot.id,
          scheduledAt:    selected.slot.date,
          notes:          'Service: ' + selected.service.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      // Send confirmation email
      await fetch('/api/email/booking-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName:  data.data.clientName,
          clientEmail: data.data.clientEmail,
          stylistName: selected.stylist?.user?.name,
          serviceName: selected.service?.name,
          date:        formatSlotDate(selected.slot),
          time:        formatTime(selected.slot.startTime) + ' - ' + formatTime(selected.slot.endTime),
        }),
      });

      toast.success(intl.formatMessage({ id: 'booking.success.title' }));
      setSuccess(true);
    } catch (err) {
      const msg = err.message || 'Booking failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.panel}>
          <div className={styles.success}>
            <div className={styles.successIcon}>✦</div>
            <h2 className={styles.successTitle}><FormattedMessage id="booking.success.title" /></h2>
            <p className={styles.successSub}>
              <FormattedMessage id="booking.success.sub" values={{ name: selected.stylist?.user?.name }} />
            </p>
            <Link href="/" className={styles.confirmBtn} style={{ display: 'inline-block', textDecoration: 'none', padding: '0.75rem 2rem' }}>
              <FormattedMessage id="booking.success.btn" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}><FormattedMessage id="booking.eyebrow" /></p>
        <h1 className={styles.title}><FormattedMessage id="booking.title" /></h1>
        <p className={styles.subtitle}><FormattedMessage id="booking.sub" /></p>
        <div className={styles.divider}><span>✦</span></div>
      </div>

      {/* Steps */}
      <div className={styles.steps}>
        {STEP_IDS.map((id, i) => (
          <div key={id} className={`${styles.step} ${i === step ? styles.active : ''} ${i < step ? styles.done : ''}`}>
            <div className={styles.stepNum}>{i < step ? '✓' : i + 1}</div>
            <span className={styles.stepLabel}><FormattedMessage id={id} /></span>
          </div>
        ))}
      </div>

      <div className={styles.panel}>

        {/* Step 0 — Info */}
        {step === 0 && (
          <>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.info.title" /></h2>
            <form onSubmit={handleInfoSubmit} className={styles.infoForm}>
              <div className={styles.infoField}>
                <label className={styles.infoLabel}><FormattedMessage id="booking.info.name" /></label>
                <input
                  className={styles.infoInput}
                  type="text"
                  placeholder={intl.formatMessage({ id: 'booking.info.name.placeholder' })}
                  value={info.name}
                  onChange={e => setInfo({ ...info, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.infoField}>
                <label className={styles.infoLabel}><FormattedMessage id="booking.info.email" /></label>
                <input
                  className={styles.infoInput}
                  type="email"
                  placeholder={intl.formatMessage({ id: 'booking.info.email.placeholder' })}
                  value={info.email}
                  onChange={e => setInfo({ ...info, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles.infoField}>
                <label className={styles.infoLabel}><FormattedMessage id="booking.info.phone" /></label>
                <input
                  className={styles.infoInput}
                  type="tel"
                  placeholder={intl.formatMessage({ id: 'booking.info.phone.placeholder' })}
                  value={info.phone}
                  onChange={e => setInfo({ ...info, phone: e.target.value })}
                />
              </div>
              <button className={styles.confirmBtn} type="submit">
                <FormattedMessage id="booking.info.next" />
              </button>
            </form>
          </>
        )}

        {loading && step > 0 && <p className={styles.loading}><FormattedMessage id="booking.loading" /></p>}

        {/* Step 1 — Service */}
        {!loading && step === 1 && (
          <>
            <button className={styles.backBtn} onClick={() => setStep(0)}><FormattedMessage id="booking.back" /></button>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.choose.service" /></h2>
            <div className={styles.grid}>
              {serviceList.map((s) => (
                <div key={s.id}
                  className={`${styles.optionCard} ${selected.service?.id === s.id ? styles.selected : ''}`}
                  onClick={() => { setSelected({ ...selected, service: s }); setStep(2); }}>
                  {s.imageUrl && (
                    <img src={s.imageUrl} alt={s.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '3px 3px 0 0', display: 'block', marginBottom: '0.75rem' }} />
                  )}
                  <p className={styles.optionName}>{s.name}</p>
                  <p className={styles.optionSub}>${Number(s.price).toFixed(2)} · {s.durationMin} min</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2 — Stylist */}
        {!loading && step === 2 && (
          <>
            <button className={styles.backBtn} onClick={() => setStep(1)}><FormattedMessage id="booking.back" /></button>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.choose.stylist" /></h2>
            <div className={styles.grid}>
              {stylistList.map((st) => (
                <div key={st.id}
                  className={`${styles.optionCard} ${selected.stylist?.id === st.id ? styles.selected : ''}`}
                  onClick={() => { setSelected({ ...selected, stylist: st }); setStep(3); }}>
                  {st.user?.avatarUrl && (
                    <img src={st.user.avatarUrl} alt={st.user?.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem', border: '1px solid var(--border)' }} />
                  )}
                  <p className={styles.optionName}>{st.user?.name}</p>
                  <p className={styles.optionSub}>{st.specialties || intl.formatMessage({ id: 'booking.stylist.specialties' })}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 3 — Slot */}
        {!loading && step === 3 && (
          <>
            <button className={styles.backBtn} onClick={() => setStep(2)}><FormattedMessage id="booking.back" /></button>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.choose.slot" /></h2>
            {slotList.length === 0
              ? <p className={styles.empty}><FormattedMessage id="booking.noSlots" /></p>
              : (
                <div className={styles.slotGrid}>
                  {slotList.map((slot) => (
                    <div key={slot.id}
                      className={`${styles.slot} ${selected.slot?.id === slot.id ? styles.selected : ''}`}
                      onClick={() => { setSelected({ ...selected, slot }); setStep(4); }}>
                      <p className={styles.slotDate}>{formatSlotDate(slot)}</p>
                      <p className={styles.slotTime}>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
                    </div>
                  ))}
                </div>
              )
            }
          </>
        )}

        {/* Step 4 — Confirm */}
        {step === 4 && (
          <>
            <button className={styles.backBtn} onClick={() => setStep(3)}><FormattedMessage id="booking.back" /></button>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.confirm.title" /></h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.info.name" /></span><span>{info.name}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.info.email" /></span><span>{info.email}</span></div>
              {info.phone && <div className={styles.summaryRow}><span><FormattedMessage id="booking.info.phone" /></span><span>{info.phone}</span></div>}
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.service" /></span><span>{selected.service?.name}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.stylist" /></span><span>{selected.stylist?.user?.name}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.date" /></span><span>{selected.slot && formatSlotDate(selected.slot)}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.time" /></span><span>{selected.slot && formatTime(selected.slot.startTime) + ' - ' + formatTime(selected.slot.endTime)}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.price" /></span><span>${Number(selected.service?.price).toFixed(2)}</span></div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.confirmBtn} onClick={handleConfirm} disabled={submitting}>
              {submitting ? <FormattedMessage id="booking.confirming" /> : <FormattedMessage id="booking.confirm.btn" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}