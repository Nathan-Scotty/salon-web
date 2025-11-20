import Banner from '../components/faqs/Banner';
import Faq from '../components/faqs/Faqs';
import Head from 'next/head';


export default function Faqs() {


    return (
        <>
            <Head>
                <title>DHB Davilas Hair & Beauty | FAQs</title>
                <meta name="description" content="Welcome to Davilas Hair & Beauty – Experience the best hair care and styling services tailored to your needs." />

                <meta property="og:title" content="DHB-Davilas Hair & Beauty | FAQs" />
                <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
                <meta property="og:image" content="/davilas_logo.png" />
            </Head>
            <Banner />
            <Faq />
        </>
    );
};


