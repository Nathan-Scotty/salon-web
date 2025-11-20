import Service from '../components/service/Service';
import Banner from '../components/service/Banner';
import Head from 'next/head';

export default function Services() {

    return (
        <>
            <Head>
                <title>DHB Davilas Hair & Beauty | Service</title>
                <meta name="description" content="Welcome to Davilas Hair & Beauty – Experience the best hair care and styling services tailored to your needs." />

                <meta property="og:title" content="Davilas Hair & Beauty | Service" />
                <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
                <meta property="og:image" content="/davilas_logo.png" />
            </Head>
            <Banner />
            <Service />
        </>
    );
}



