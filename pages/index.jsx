import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FormattedMessage, useIntl } from 'react-intl';
import { services as servicesApi, posts as postsApi, stylists as stylistsApi } from '../lib/api';
import styles from '../styles/Home.module.css';

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80',
  'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80',
  'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&q=80',
];

const PLACEHOLDER_GALLERY = [
  { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', caption: 'Balayage & Highlights' },
  { src: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80', caption: 'Color Treatment' },
  { src: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80', caption: 'Precision Cut' },
  { src: 'https://images.unsplash.com/photo-1595152452543-e5fc22cbe868?w=600&q=80', caption: 'Natural Styling' },
  { src: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80', caption: 'Blowout & Style' },
  { src: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80', caption: "Men's Cut" },
  { src: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?w=1200&q=80', caption: 'Salon Experience' },
];

const PLACEHOLDER_BEFORE_AFTER = [
  {
    before: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e4?w=400&q=80',
    after: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
    title: 'Balayage Transformation',
  },
  {
    before: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80',
    after: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400&q=80',
    title: 'Color Correction',
  },
  {
    before: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80',
    after: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&q=80',
    title: 'Keratin Treatment',
  },
];

const TESTIMONIALS = [
  { text: 'Absolutely incredible experience. Sophia transformed my hair completely — I walked out feeling like a new person.', name: 'Camille R.', stars: '★★★★★', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80' },
  { text: 'Best salon in the Ottawa-Gatineau region by far. The team is professional, warm, and incredibly talented.', name: 'Jessica M.', stars: '★★★★★', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { text: 'I was nervous about a big change but Marcus made me feel so comfortable. The result was exactly what I had in mind.', name: 'Daniel T.', stars: '★★★★★', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&q=80' },
];

const STATS = [
  { num: '500+', labelId: 'home.stats.clients' },
  { num: '8+', labelId: 'home.stats.years' },
  { num: '15+', labelId: 'home.stats.services' },
  { num: '100%', labelId: 'home.stats.satisfaction' },
];

export default function Home() {
  const [serviceList, setServiceList] = useState([]);
  const [galleryPosts, setGalleryPosts] = useState([]);
  const [beforeAfterPosts, setBAP] = useState([]);
  const [stylistList, setStylistList] = useState([]);

  useEffect(() => {
    servicesApi.getAll(true).then(setServiceList).catch(console.error);
    postsApi.getAll(true, 'GALLERY').then(setGalleryPosts).catch(console.error);
    postsApi.getAll(true, 'BEFORE_AFTER').then(setBAP).catch(console.error);
    stylistsApi.getAll().then(setStylistList).catch(console.error);
  }, []);

  const placeholderServices = [
    { id: 1, name: 'Balayage', price: 150, durationMin: 120 },
    { id: 2, name: 'Color Treatment', price: 120, durationMin: 90 },
    { id: 3, name: 'Precision Cut', price: 80, durationMin: 60 },
    { id: 4, name: 'Keratin', price: 200, durationMin: 150 },
  ];

  const displayServices = serviceList.length > 0 ? serviceList.slice(0, 4) : placeholderServices;
  const displayBA = beforeAfterPosts.length > 0 ? beforeAfterPosts.slice(0, 3) : null;
  const displayGallery = galleryPosts.length > 0
    ? galleryPosts.slice(0, 7).flatMap(p => p.media?.filter(m => m.type === 'IMAGE').slice(0, 1).map(m => ({ src: m.url, caption: p.title })) || [])
    : PLACEHOLDER_GALLERY;

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}><FormattedMessage id="home.eyebrow" /></p>
          <h1 className={styles.heroTitle}>
            <FormattedMessage id="home.hero.title" /> <em><FormattedMessage id="home.hero.title.em" /></em>
          </h1>
          <p className={styles.heroSub}><FormattedMessage id="home.hero.sub" /></p>
          <div className={styles.heroBtns}>
            <Link href="/projects" className={styles.btnOutline}><FormattedMessage id="home.hero.btn.gallery" /></Link>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <span><FormattedMessage id="home.hero.scroll" /></span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ── Stats ── */}
      <div className={styles.statsBar}>
        {STATS.map((s) => (
          <div key={s.labelId} className={styles.statItem}>
            <p className={styles.statNum}>{s.num}</p>
            <p className={styles.statLabel}><FormattedMessage id={s.labelId} /></p>
          </div>
        ))}
      </div>

      {/* ── Services ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHero}>
            <p className={styles.sectionEyebrow}><FormattedMessage id="home.services.eyebrow" /></p>
            <h2 className={styles.sectionTitle}><FormattedMessage id="home.services.title" /></h2>
            <p className={styles.sectionSub}><FormattedMessage id="home.services.sub" /></p>
            <div className={styles.divider}><span>✦</span></div>
          </div>
          <div className={styles.servicesGrid}>
            {displayServices.map((s, i) => (
              <Link key={s.id} href="/booking" className={styles.serviceCard}>
                {s.imageUrl && (
                  <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '3px 3px 0 0', marginBottom: '1rem' }}>
                    <img src={s.imageUrl} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div className={styles.serviceCardBody}>
                  <div className={styles.serviceCardTop}>
                    <span className={styles.serviceName}>{s.name}</span>
                    <span className={styles.servicePrice}>${Number(s.price).toFixed(2)}</span>
                  </div>
                  <p className={styles.serviceDuration}>{s.durationMin} min</p>
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.seeAllWrap}>
            <Link href="/services" className={styles.btnOutlineDark}><FormattedMessage id="home.services.viewAll" /></Link>
          </div>
        </div>
      </section>

      {/* ── Before & After ── */}
      <section className={styles.section} style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHero}>
            <p className={styles.sectionEyebrow}><FormattedMessage id="home.beforeAfter.eyebrow" /></p>
            <h2 className={styles.sectionTitle}><FormattedMessage id="home.beforeAfter.title" /></h2>
            <p className={styles.sectionSub}><FormattedMessage id="home.beforeAfter.sub" /></p>
            <div className={styles.divider}><span>✦</span></div>
          </div>
          <div className={styles.beforeAfterGrid}>
            {(displayBA || PLACEHOLDER_BEFORE_AFTER).map((item, i) => {
              const isDynamic = !!displayBA;
              const before = isDynamic ? item.media?.[0]?.url : item.before;
              const after = isDynamic ? item.media?.[1]?.url : item.after;
              const title = isDynamic ? item.title : item.title;
              return (
                <div key={i} className={styles.beforeAfterCard}>
                  <div className={styles.beforeAfterImgs}>
                    {before ? <img src={before} alt="Before" className={styles.beforeAfterImg} /> : <div className={styles.beforeAfterImg} style={{ background: 'var(--surface2)' }} />}
                    {after ? <img src={after} alt="After" className={styles.beforeAfterImg} /> : <div className={styles.beforeAfterImg} style={{ background: 'var(--surface2)' }} />}
                  </div>
                  <div className={styles.beforeAfterLabel}>
                    <span><FormattedMessage id="home.beforeAfter.label.after" /></span>
                    <span><FormattedMessage id="home.beforeAfter.label.before" /></span>
                  </div>
                  <div className={styles.beforeAfterInfo}>
                    <p className={styles.beforeAfterTitle}>{title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHero}>
            <p className={styles.sectionEyebrow}><FormattedMessage id="home.gallery.eyebrow" /></p>
            <h2 className={styles.sectionTitle}><FormattedMessage id="home.gallery.title" /></h2>
            <p className={styles.sectionSub}><FormattedMessage id="home.gallery.sub" /></p>
            <div className={styles.divider}><span>✦</span></div>
          </div>
          <div className={styles.galleryGrid}>
            {displayGallery.map((item, i) => (
              <div key={i} className={styles.galleryItem}>
                <img src={item.src} alt={item.caption} className={styles.galleryImg} />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.seeAllWrap}>
            <Link href="/projects" className={styles.btnOutlineDark}><FormattedMessage id="home.gallery.viewAll" /></Link>
          </div>
        </div>
      </section>

      {/* ── Interior CTA ── */}
      <section className={styles.interiorSection}>
        <div className={styles.interiorBg} />
        <div className={styles.interiorContent}>
          <p className={styles.interiorEyebrow}><FormattedMessage id="home.interior.eyebrow" /></p>
          <h2 className={styles.interiorTitle}><FormattedMessage id="home.interior.title" /></h2>
          <p className={styles.interiorSub}><FormattedMessage id="home.interior.sub" /></p>
        </div>
      </section>

      {/* ── Team ── */}
      {stylistList.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHero}>
              <p className={styles.sectionEyebrow}><FormattedMessage id="home.team.eyebrow" /></p>
              <h2 className={styles.sectionTitle}><FormattedMessage id="home.team.title" /></h2>
              <p className={styles.sectionSub}><FormattedMessage id="home.team.sub" /></p>
              <div className={styles.divider}><span>✦</span></div>
            </div>
            <div className={styles.teamGrid}>
              {stylistList.map((st) => (
                <div key={st.id} className={styles.teamCard}>
                  {st.user?.avatarUrl
                    ? <img src={st.user.avatarUrl} alt={st.user?.name} className={styles.teamImg} />
                    : <div className={styles.teamImgPlaceholder}><span>{st.user?.name?.charAt(0)}</span></div>
                  }
                  <div className={styles.teamBody}>
                    <h3 className={styles.teamName}>{st.user?.name}</h3>
                    {st.specialties && <p className={styles.teamRole}>{st.specialties}</p>}
                    {st.bio && <p className={styles.teamBio}>{st.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.seeAllWrap}>
              <Link href="/about" className={styles.btnOutlineDark}><FormattedMessage id="home.team.viewAll" /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section className={styles.section} style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHero}>
            <p className={styles.sectionEyebrow}><FormattedMessage id="home.testimonials.eyebrow" /></p>
            <h2 className={styles.sectionTitle}><FormattedMessage id="home.testimonials.title" /></h2>
            <p className={styles.sectionSub}><FormattedMessage id="home.testimonials.sub" /></p>
            <div className={styles.divider}><span>✦</span></div>
          </div>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.testimonialAuthor}>
                  <img src={t.avatar} alt={t.name} className={styles.testimonialAvatar} />
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialStars}>{t.stars}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}><FormattedMessage id="home.cta.title" /></h2>
        <p className={styles.ctaSub}><FormattedMessage id="home.cta.sub" /></p>
        <Link href="/booking" className={styles.btnPrimary}><FormattedMessage id="home.cta.btn" /></Link>
      </section>

    </div>
  );
}
