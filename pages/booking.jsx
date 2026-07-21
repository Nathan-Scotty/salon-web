import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { services as servicesApi, stylists as stylistsApi, availability as availApi, appointments as apptApi, clients, getUserId, isLoggedIn } from '../lib/api';
import { useToast } from '../components/Toast';
import styles from '../styles/Booking.module.css';

const STEP_IDS = ['booking.step.service', 'booking.step.stylist', 'booking.step.slot', 'booking.step.confirm'];

export default function BookingPage() {
  const toast   = useToast();
  const router  = useRouter();
  const intl    = useIntl();
  const [step, setStep]               = useState(0);
  const [serviceList, setServiceList] = useState([]);
  const [stylistList, setStylistList] = useState([]);
  const [slotList, setSlotList]       = useState([]);
  const [selected, setSelected]       = useState({ service: null, stylist: null, slot: null });
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState(false);

  useEffect(() => {
    Promise.all([servicesApi.getAll(true), stylistsApi.getAll()])
      .then(([s, st]) => { setServiceList(s); setStylistList(st); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (step === 2 && selected.stylist) {
      setLoading(true);
      availApi.getAll(selected.stylist.id, true)
        .then(setSlotList).catch(console.error).finally(() => setLoading(false));
    }
  }, [step, selected.stylist]);

  const formatSlotDate = (slot) =>
    new Date(slot.date).toLocaleDateString(intl.locale, { weekday: 'short', month: 'short', day: 'numeric' });

  const formatTime = (timeStr) =>
    new Date(timeStr).toLocaleTimeString(intl.locale, { hour: '2-digit', minute: '2-digit' });

  const handleConfirm = async () => {
    if (!isLoggedIn()) { router.push('/signin'); return; }
    setSubmitting(true); setError('');
    try {
      const userId      = Number(getUserId());
      const clientList  = await clients.getAll();
      const clientProfile = clientList.find(c => c.userId === userId);

      if (!clientProfile) {
        setError('Client profile not found. Please contact support.');
        setSubmitting(false);
        return;
      }

      await apptApi.create({
        clientId:       clientProfile.id,
        stylistId:      selected.stylist.id,
        availabilityId: selected.slot.id,
        scheduledAt:    selected.slot.date,
        notes:          'Service: ' + selected.service.name,
      });

      await fetch('/api/email/booking-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName:  clientProfile.user?.name,
          clientEmail: clientProfile.user?.email,
          stylistName: selected.stylist?.user?.name,
          serviceName: selected.service?.name,
          date:        formatSlotDate(selected.slot),
          time:        formatTime(selected.slot.startTime) + ' – ' + formatTime(selected.slot.endTime),
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
        {loading && <p className={styles.loading}><FormattedMessage id="booking.loading" /></p>}

        {/* Step 0 — Service */}
        {!loading && step === 0 && (
          <>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.choose.service" /></h2>
            <div className={styles.grid}>
              {serviceList.map((s) => (
                <div key={s.id} className={`${styles.optionCard} ${selected.service?.id === s.id ? styles.selected : ''}`}
                  onClick={() => { setSelected({ ...selected, service: s }); setStep(1); }}>
                  <p className={styles.optionName}>{s.name}</p>
                  <p className={styles.optionSub}>${Number(s.price).toFixed(2)} · {s.durationMin} min</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 1 — Stylist */}
        {!loading && step === 1 && (
          <>
            <button className={styles.backBtn} onClick={() => setStep(0)}><FormattedMessage id="booking.back" /></button>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.choose.stylist" /></h2>
            <div className={styles.grid}>
              {stylistList.map((st) => (
                <div key={st.id} className={`${styles.optionCard} ${selected.stylist?.id === st.id ? styles.selected : ''}`}
                  onClick={() => { setSelected({ ...selected, stylist: st }); setStep(2); }}>
                  <p className={styles.optionName}>{st.user?.name}</p>
                  <p className={styles.optionSub}>{st.specialties || intl.formatMessage({ id: 'booking.stylist.specialties' })}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2 — Slot */}
        {!loading && step === 2 && (
          <>
            <button className={styles.backBtn} onClick={() => setStep(1)}><FormattedMessage id="booking.back" /></button>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.choose.slot" /></h2>
            {slotList.length === 0
              ? <p className={styles.empty}><FormattedMessage id="booking.noSlots" /></p>
              : (
                <div className={styles.slotGrid}>
                  {slotList.map((slot) => (
                    <div key={slot.id} className={`${styles.slot} ${selected.slot?.id === slot.id ? styles.selected : ''}`}
                      onClick={() => { setSelected({ ...selected, slot }); setStep(3); }}>
                      <p className={styles.slotDate}>{formatSlotDate(slot)}</p>
                      <p className={styles.slotTime}>{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</p>
                    </div>
                  ))}
                </div>
              )
            }
          </>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <>
            <button className={styles.backBtn} onClick={() => setStep(2)}><FormattedMessage id="booking.back" /></button>
            <h2 className={styles.sectionTitle}><FormattedMessage id="booking.confirm.title" /></h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.service" /></span><span>{selected.service?.name}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.stylist" /></span><span>{selected.stylist?.user?.name}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.date" /></span><span>{selected.slot && formatSlotDate(selected.slot)}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.time" /></span><span>{selected.slot && formatTime(selected.slot.startTime) + ' – ' + formatTime(selected.slot.endTime)}</span></div>
              <div className={styles.summaryRow}><span><FormattedMessage id="booking.confirm.price" /></span><span>${Number(selected.service?.price).toFixed(2)}</span></div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {!isLoggedIn() && (
              <p className={styles.error}>
                <FormattedMessage id="booking.signin.required" /> <Link href="/signin" style={{ color: 'var(--gold)' }}><FormattedMessage id="booking.signin.link" /></Link>
              </p>
            )}
            <button className={styles.confirmBtn} onClick={handleConfirm} disabled={submitting}>
              {submitting ? <FormattedMessage id="booking.confirming" /> : <FormattedMessage id="booking.confirm.btn" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
