import Head from 'next/head';
import styles from '../styles/Index.module.css';
import About from '../components/about/AboutUs';
import Faqs from '../components/faqs/Faqs';
import Contact from '../components/contact/Contact';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

export default function Home() {
  return (
    <>
      <Head>
        <title>DHB Davilas Hair & Beauty | Home</title>
        <meta name="description" content="Welcome to Davilas Hair & Beauty – Experience the best hair care and styling services tailored to your needs." />

        <meta property="og:title" content="DHB-Davilas Hair & Beauty | Home" />
        <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
        <meta property="og:image" content="/davilas_logo.png" />
      </Head>
      <About />
      <Faqs />
      <Contact />
    </>
  );
}
