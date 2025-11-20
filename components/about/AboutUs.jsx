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
import { useRef } from 'react';

const video1 = '/video1.mp4';
const video2 = '/video2.mp4';
const video3 = '/video3.mp4';
const video4 = '/video4.mp4';

export default function About() {
    const videoRefs = useRef([]);

    const handleVideoPlay = (index) => {
        videoRefs.current.forEach((video, i) => {
            if (video && i !== index) {
                video.pause();
            }
        });
    }
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

            <section className={styles.videoSection}>
                <div className={styles.videoHeader}>
                    <h2><FormattedMessage id="videos.title" defaultMessage="Découvrez-nous en vidéo" /></h2>
                    <p><FormattedMessage id="videos.subtitle" defaultMessage="Visite du salon, transformations, coulisses et avis clients" /></p>
                </div>

                <div className={styles.videoGrid}>
                    {/* Vidéo 1 */}
                    <div className={styles.videoWrapper}>
                        <video
                            ref={(el) => (videoRefs.current[0] = el)}
                            src={video1}
                            poster="/dhb_logo.jpg" // ← image de preview (optionnel mais joli)
                            controls
                            preload="metadata"
                            className={styles.localVideo}
                            onPlay={() => handleVideoPlay(0)}
                        >
                            Votre navigateur ne supporte pas la vidéo.
                        </video>
                        <p className={styles.videoCaption}>Visite complète du salon</p>
                    </div>

                    {/* Vidéo 2 */}
                    <div className={styles.videoWrapper}>
                        <video
                            ref={(el) => (videoRefs.current[1] = el)}
                            src={video2}
                            poster="/dhb_logo.jpg"
                            controls
                            preload="metadata"
                            className={styles.localVideo}
                            onPlay={() => handleVideoPlay(1)}
                        />
                        <p className={styles.videoCaption}>Transformation avant/après</p>
                    </div>

                    {/* Vidéo 3 */}
                    <div className={styles.videoWrapper}>
                        <video
                            ref={(el) => (videoRefs.current[2] = el)}
                            src={video3}
                            poster="/dhb_logo.jpg"
                            controls
                            preload="metadata"
                            className={styles.localVideo}
                            onPlay={() => handleVideoPlay(2)}
                        />
                        <p className={styles.videoCaption}>Dans les coulisses</p>
                    </div>

                    {/* Vidéo 4 */}
                    <div className={styles.videoWrapper}>
                        <video
                            ref={(el) => (videoRefs.current[3] = el)}
                            src={video4}
                            poster="/dhb_logo.jpg"
                            controls
                            preload="metadata"
                            className={styles.localVideo}
                            onPlay={() => handleVideoPlay(3)}
                        />
                        <p className={styles.videoCaption}>Ce que disent nos clients</p>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US - STYLE VIDÉOS (plein écran, hover sexy) */}
            <section className={styles.reason}>
                <div className={styles.reasonHeader}>
                    <h2><FormattedMessage id="why.title" /></h2>
                    <h3><FormattedMessage id="why.subtitle" /></h3>
                </div>

                <div className={styles.servicesGrid}>   {/* ← même grid que les vidéos */}
                    {/* Service 1 */}
                    <div className={styles.serviceCard}>
                        <div className={styles.serviceImageWrapper}>
                            <Image
                                src={pexels1}
                                alt="Styliste professionnelle"
                                fill
                                className={styles.serviceImage}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        </div>
                        <div className={styles.serviceContent}>
                            <h4><FormattedMessage id="services.stylist.title" /></h4>
                            <p><FormattedMessage id="services.stylist.text" /></p>
                        </div>
                    </div>

                    {/* Service 2 */}
                    <div className={styles.serviceCard}>
                        <div className={styles.serviceImageWrapper}>
                            <Image
                                src={pexels2}
                                alt="Produits premium"
                                fill
                                className={styles.serviceImage}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        </div>
                        <div className={styles.serviceContent}>
                            <h4><FormattedMessage id="services.products.title" /></h4>
                            <p><FormattedMessage id="services.products.text" /></p>
                        </div>
                    </div>

                    {/* Service 3 */}
                    <div className={styles.serviceCard}>
                        <div className={styles.serviceImageWrapper}>
                            <Image
                                src={pexels3}
                                alt="Styles tendance"
                                fill
                                className={styles.serviceImage}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        </div>
                        <div className={styles.serviceContent}>
                            <h4><FormattedMessage id="services.styles.title" /></h4>
                            <p><FormattedMessage id="services.styles.text" /></p>
                        </div>
                    </div>

                    {/* Service 4 */}
                    <div className={styles.serviceCard}>
                        <div className={styles.serviceImageWrapper}>
                            <Image
                                src={pexels4}
                                alt="Expérience relaxante"
                                fill
                                className={styles.serviceImage}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        </div>
                        <div className={styles.serviceContent}>
                            <h4><FormattedMessage id="services.experience.title" /></h4>
                            <p><FormattedMessage id="services.experience.text" /></p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}