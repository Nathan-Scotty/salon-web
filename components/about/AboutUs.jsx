import Image from 'next/image';
import styles from './stylesheets/AboutUs.module.css';
import { FormattedMessage } from 'react-intl';

// Import your images (place them in /public/images/)
import heroImg from '../../public/salon-hero.jpg';
import stylistImg from '../../public/stylish-working.jpg';

// Service Icons (SVG or PNG - place in /public/icons/)
import pexels1 from '../../public/pexels-10.jpeg';
import pexels2 from '../../public/pexels-9.jpeg';
import pexels3 from '../../public/pexels-4.jpeg';
import pexels4 from '../../public/pexels-3.jpeg';

export default function About() {
    return (
        <>
            {/* HERO SECTION WITH IMAGE */}
            <div className={styles.hero}>
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroTitle}><FormattedMessage id="hero.title" /></h1>
                    <p className={styles.heroSubtitle}><FormattedMessage id="hero.subtitle" /></p>
                </div>
            </div>

            {/* ABOUT US SECTION */}
            <section className={styles.containerAbout}>
                <div className={styles.aboutContent}>
                    <h2 className={styles.sectionTitle}><FormattedMessage id="about.title" /></h2>
                    <p className={styles.aboutText}>
                        <FormattedMessage id="about.description" />
                    </p>

                    {/* MISSION WITH IMAGE */}
                    <div className={styles.missionGrid}>
                        <div className={styles.missionText}>
                            <h3><FormattedMessage id="mission.title" /></h3>
                            <p>
                                <FormattedMessage id="mission.text" />
                            </p>
                        </div>
                        <div className={styles.missionImage}>
                            <Image
                                src={stylistImg}
                                alt="Professional stylist at work"
                                width={500}
                                height={350}
                                className={styles.roundedImage}
                            />
                        </div>
                    </div>

                    {/* VISION WITH IMAGE */}
                    <div className={styles.visionGrid}>
                        <div className={styles.visionImage}>
                            <Image
                                src={heroImg}
                                alt="Relaxing salon interior"
                                width={500}
                                height={350}
                                className={styles.roundedImage}
                            />
                        </div>
                        <div className={styles.visionText}>
                            <h3><FormattedMessage id="vision.title" /></h3>
                            <ul className={styles.visionList}>
                                <li><FormattedMessage id="vision.point1" /></li>
                                <li><FormattedMessage id="vision.point2" /></li>
                                <li><FormattedMessage id="vision.point3" /></li>
                                <li><FormattedMessage id="vision.point4" /></li>
                            </ul>
                            <p className={styles.ctaText}>
                                <FormattedMessage id="vision.cta" />
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US - WITH ICONS */}
            <section className={styles.reason}>
                <div className={styles.reasonHeader}>
                    <h2><FormattedMessage id="why.title" /></h2>
                    <h3><FormattedMessage id="why.subtitle" /></h3>
                </div>

                <div className={styles.services}>
                    {/* Service 1 */}
                    <div className={styles.service}>
                        <div className={styles.iconWrapper}>
                            <Image src={pexels1} alt="Scissors" width={400} height={400} />
                        </div>
                        <h4><FormattedMessage id="services.stylist.title" /></h4>
                        <p><FormattedMessage id="services.stylist.text" /></p>
                    </div>

                    {/* Service 2 */}
                    <div className={styles.service}>
                        <div className={styles.iconWrapper}>
                            <Image src={pexels2} alt="Premium Products" width={400} height={400} />
                        </div>
                        <h4><FormattedMessage id="services.products.title" /></h4>
                        <p><FormattedMessage id="services.products.text" /></p>
                    </div>

                    {/* Service 3 */}
                    <div className={styles.service}>
                        <div className={styles.iconWrapper}>
                            <Image src={pexels3} alt="Trendy Styles" width={400} height={400} />
                        </div>
                        <h4><FormattedMessage id="services.styles.title" /></h4>
                        <p><FormattedMessage id="services.styles.text" /></p>
                    </div>

                    {/* Service 4 */}
                    <div className={styles.service}>
                        <div className={styles.iconWrapper}>
                            <Image src={pexels4} alt="Relaxing Experience" width={400} height={400} />
                        </div>
                        <h4><FormattedMessage id="services.experience.title" /></h4>
                        <p><FormattedMessage id="services.experience.text" /></p>
                    </div>
                </div>
            </section>
        </>
    );
}