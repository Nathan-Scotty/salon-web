import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { stylists as stylistsApi } from '../lib/api';
import styles from '../styles/About.module.css';

const VALUES = [
    { icon: '✦', nameId: 'about.value1.name', descId: 'about.value1.desc' },
    { icon: '◈', nameId: 'about.value2.name', descId: 'about.value2.desc' },
    { icon: '❋', nameId: 'about.value3.name', descId: 'about.value3.desc' },
    { icon: '◇', nameId: 'about.value4.name', descId: 'about.value4.desc' },
];

export default function AboutPage() {
    const [stylistList, setStylistList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        stylistsApi.getAll().then(setStylistList).catch(console.error).finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <p className={styles.eyebrow}><FormattedMessage id="about.eyebrow" /></p>
                <h1 className={styles.title}><FormattedMessage id="about.title" /></h1>
                <p className={styles.subtitle}><FormattedMessage id="about.sub" /></p>
                <div className={styles.divider}><span>✦</span></div>
            </div>

            <div className={styles.values}>
                {VALUES.map((v) => (
                    <div key={v.nameId} className={styles.valueCard}>
                        <div className={styles.valueIcon}>{v.icon}</div>
                        <h3 className={styles.valueName}><FormattedMessage id={v.nameId} /></h3>
                        <p className={styles.valueDesc}><FormattedMessage id={v.descId} /></p>
                    </div>
                ))}
            </div>

            <div className={styles.stylistsSection}>
                <h2 className={styles.sectionTitle}><FormattedMessage id="about.team.title" /></h2>
                {loading && <p className={styles.loading}><FormattedMessage id="about.loading" /></p>}
                {!loading && (
                    <div className={styles.teamGrid}>
                        {stylistList.map((st) => (
                            <div key={st.id} className={styles.teamCard}>
                                {st.user?.avatarUrl ? (
                                    <img src={st.user.avatarUrl} alt={st.user?.name} className={styles.teamImg} />
                                ) : (
                                    <div className={styles.teamImgPlaceholder}>
                                        <span>{st.user?.name?.charAt(0)}</span>
                                    </div>
                                )}
                                <div className={styles.teamBody}>
                                    <h3 className={styles.teamName}>{st.user?.name}</h3>
                                    {st.specialties && <p className={styles.teamRole}>{st.specialties}</p>}
                                    {st.bio && <p className={styles.teamBio}>{st.bio}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
