import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './stylesheets/Service.module.css';
import pexels1 from '../../public/pexels-10.jpg';
import pexels2 from '../../public/pexels-10.jpg';
import pexels3 from '../../public/pexels-10.jpg';
import pexels4 from '../../public/pexels-10.jpg';

export default function Service() {
    const [selectedImage, setSelectedImage] = useState(null);

    const openImage = (image) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const services = [
        { image: pexels1, title: "Men’s Haircuts", description: "Our skilled technicians provide comprehensive maintenance services to ensure the smooth operation of your equipment and industrial machines. We guarantee fast and efficient service." },
        { image: pexels2, title: "Women’s Haircuts", description: "Our skilled technicians provide comprehensive maintenance services to ensure the smooth operation of your equipment and industrial machines. We guarantee fast and efficient service." },
        { image: pexels3, title: "Hair Coloring", description: "Our skilled technicians provide comprehensive maintenance services to ensure the smooth operation of your equipment and industrial machines. We guarantee fast and efficient service." },
        { image: pexels4, title: "Beard Grooming & Shaving", description: "Our skilled technicians provide comprehensive maintenance services to ensure the smooth operation of your equipment and industrial machines. We guarantee fast and efficient service." },
    ];

    return (
        <div>
            <h1 style={{ textAlign: 'center', fontFamily: 'inherit' }}>Our Services</h1>
            <p style={{ textAlign: 'center', fontSize: '21px', fontFamily: 'inherit' }}>
                Discover the full range of our professional services
            </p>

            <div className={styles.servicesContainer}>
                <div className={styles.servicesList}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.serviceCard}>
                            <Image
                                src={service.image}
                                alt={service.title}
                                width={500}
                                height={300}
                                className={styles.serviceImage}
                                onClick={() => openImage(service.image)}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className={styles.serviceContent}>
                                <h2 className={styles.serviceTitle}>{service.title}</h2>
                                <p className={styles.serviceDescription}>{service.description}</p>
                                <Link className={styles.contactLink} href="/contact">
                                    Contactez-nous
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div className={styles.modal} onClick={closeImage}>
                    <span className={styles.close} onClick={closeImage}>
                        &times;
                    </span>
                    <Image src={selectedImage} alt="Selected" width={800} height={600} className={styles.modalContent} />
                </div>
            )}
        </div>
    );
};

