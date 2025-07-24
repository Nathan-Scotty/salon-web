import Image from 'next/image'
import img from '../../public/imageAbout.jpg'
import styles from './stylesheets/AboutUs.module.css'

export default function About() {


    return <>
        <div className={styles.containerAbout}>
            <div className={styles.aboutUs}>
                <h2>About Us</h2>
                <p>
                    At [Salon Name], we are dedicated to providing high-quality hair care and styling services for both men and women. Our team of professional stylists specializes in haircuts, coloring, treatments, and modern styles that enhance your natural beauty. Whether you’re looking for a fresh cut,
                    a bold transformation, or a relaxing treatment, we ensure an exceptional salon experience tailored to your needs.
                </p>

                <section>
                    <h3>Our Mission</h3>
                    <p>"To be the leading hair salon that inspires confidence and self-expression through expert hair care, creativity, and innovation."

                        We believe that hair is an extension of your personality, and our goal is to help every client look and feel their best with styles that suit their unique identity.</p>
                </section>

                <section>
                    <h3>Our Vision</h3>
                    <p>🌟 To provide exceptional hair services in a comfortable and welcoming environment.
                        To stay updated with the latest trends and techniques to offer the best styles for men and women.
                        To use high-quality products that nourish and protect all hair types.
                        To build strong relationships with our clients through personalized care and attention.

                        At [Salon Name], your satisfaction is our priority. Book an appointment today and let us transform your hair with expertise and passion! ✨</p>
                </section>
            </div>
            <Image className={styles.imageAbout} src={img} alt='img' />
        </div>

        <section className={styles.reason}>
            <h2>Why Choose Us</h2>
            <h3>Experience Luxury Hair Care</h3>
            <div className={styles.services}>

                <div className={styles.service}>
                    <h1>✂️</h1>
                    <h4>Professional Stylists</h4>
                    <p>Our expert hairstylists bring years of experience to craft the perfect look for you.</p>
                </div>

                <div className={styles.service}>
                <h1>🧴</h1>
                    <h4>Premium Hair Products</h4>
                    <p>We use top-quality, salon-grade products to keep your hair healthy and vibrant.</p>
                </div>

                <div className={styles.service}>
                    <h1>💇‍♀️</h1>
                    <h4>Trendy & Classic Styles</h4>
                    <p>Stay ahead of the trends or embrace timeless elegance with our diverse styling options.</p>
                </div>

                <div className={styles.service}>
                    <h1>🌿</h1>
                    <h4>Relaxing Salon Experience</h4>
                    <p>Enjoy a calming atmosphere with personalized care that makes every visit special.</p>
                </div>

            </div>
        </section>

    </>
}