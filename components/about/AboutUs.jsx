import Image from 'next/image';
import styles from './stylesheets/AboutUs.module.css';
import { FormattedMessage } from 'react-intl';
import { useState, useRef } from 'react';

// Lightbox imports
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import VideoPlugin from 'yet-another-react-lightbox/plugins/video';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';

// Tes imports images existants...
import heroImg from '../../public/salon-hero.jpg';
import stylistImg from '../../public/stylish-working.jpg';
import pexels1 from '../../public/pexels-10.jpeg';
import pexels2 from '../../public/pexels-9.jpeg';
import pexels3 from '../../public/pexels-4.jpeg';
import pexels4 from '../../public/pexels-3.jpeg';

// Tes vidéos (ajoute-en autant que tu veux ici)
const allVideos = [
    {
        src: '/video1.mp4',
        poster: '/dhb_logo.jpg',
        caption: 'Visite complète du salon',
    },
    {
        src: '/video2.mp4',
        poster: '/pexels-1.jpeg',
        caption: 'Transformation avant/après',
    },
    {
        src: '/video3.mp4',
        poster: '/pexels-5.jpg',
        caption: 'Dans les coulisses',
    },
    {
        src: '/video4.mp4',
        poster: '/pexels-6.jpg',
        caption: 'Ce que disent nos clients',
    },
    // Ajoute ici tes vidéos supplémentaires (elles iront dans le lightbox)
    // {
    //   src: '/video5.mp4',
    //   poster: '/poster5.jpg',
    //   caption: 'Tutoriel coiffure rapide',
    // },
    // ...
];

const displayedVideos = allVideos.slice(0, 4); // Les 4 affichées directement

export default function About() {
    const [open, setOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const videoRefs = useRef([]);

    const handleVideoPlay = (index) => {
        videoRefs.current.forEach((vid, i) => {
            if (vid && i !== index) {
                vid.pause();
            }
        });
    };

    // Ouvre le lightbox à un index précis
    const openLightbox = (index) => {
        setLightboxIndex(index);
        setOpen(true);
    };

    // Pour le bouton "Voir plus" → commence à la 5e vidéo (index 4)
    const handleSeeMore = () => {
        setLightboxIndex(4);
        setOpen(true);
    };

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

            {/* SECTION VIDÉOS MODIFIÉE */}
            <section className={styles.videoSection}>
                <div className={styles.videoHeader}>
                    <h2><FormattedMessage id="videos.title" defaultMessage="Découvrez-nous en vidéo" /></h2>
                    <p><FormattedMessage id="videos.subtitle" defaultMessage="Visite du salon, transformations, coulisses et avis clients" /></p>
                </div>

                <div className={styles.videoGrid}>
                    {displayedVideos.map((video, idx) => (
                        <div
                            key={idx}
                            className={styles.videoWrapper}
                            onClick={() => openLightbox(idx)}
                            style={{ cursor: 'pointer' }}
                        >
                            <video
                                ref={(el) => (videoRefs.current[idx] = el)}
                                src={video.src}
                                poster={video.poster}
                                preload="metadata"
                                className={styles.localVideo}
                                controls={false} // on enlève les controls ici car on ouvre le lightbox
                                onPlay={() => handleVideoPlay(idx)}
                                muted // évite les popups autoplay
                            >
                                Votre navigateur ne supporte pas la vidéo.
                            </video>
                            <p className={styles.videoCaption}>{video.caption}</p>
                        </div>
                    ))}

                    {/* Bouton Voir plus si + de 4 vidéos */}
                    {allVideos.length > 4 && (
                        <div className={styles.seeMoreWrapper} onClick={handleSeeMore}>
                            <div className={styles.seeMoreCard}>
                                <div className={styles.seeMoreOverlay}>
                                    <span className={styles.seeMoreText}>
                                        Voir plus<br />({allVideos.length - 4})
                                    </span>
                                </div>
                                {/* Preview animée de la première vidéo supplémentaire (optionnel mais joli) */}
                                {allVideos[4] && (
                                    <video
                                        src={allVideos[4].src}
                                        poster={allVideos[4].poster}
                                        className={styles.localVideo}
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* LIGHTBOX */}
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={lightboxIndex}
                slides={allVideos.map((v) => ({
                    type: 'video',
                    sources: [{ src: v.src, type: 'video/mp4' }],
                    poster: v.poster,
                    title: v.caption,
                    alt: v.caption,
                }))}
                plugins={[VideoPlugin, Thumbnails]}
                video={{ controls: true, autoplay: false }}
                thumbnails={{ position: 'bottom', gap: 16, border: 0, height: 80 }}
                carousel={{ finite: false }} // ou true si tu ne veux pas de boucle
            />
        </>
    );
}