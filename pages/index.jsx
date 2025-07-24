import Head from 'next/head';
import styles from '../styles/Index.module.css';
import About from '../components/about/AboutUs';
import Service from '../components/service/Service';
import Faqs from '../components/faqs/Faqs';
import Contact from '../components/contact/Contact';

export default function Home() {
  return (
    <>
      <Head>
        <title>Luxury Hair Salon | Home</title>
        <meta name="description" content="Welcome to Luxury Hair Salon – Experience the best hair care and styling services tailored to your needs." />
        
        <meta property="og:title" content="Luxury Hair Salon | Home" />
        <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
        <meta property="og:image" content="../public/salon-logo.png" />
      </Head>
      <div className={styles.containers}>
        <div className={styles.overlay}></div>
        <div className={styles.contents}>
          <h1 className={styles.title}>
            Welcome to Luxury Hair Salon
          </h1>
          <p className={styles.description}>
            Experience the best hair care and styling services
          </p>
          <button className={styles.ctaButton}>Book an appointment</button>
        </div>
      </div>
      <About />
      <Service />
      <Faqs />
      <Contact />
    </>
  );
}
