import Banner from '../components/faqs/Banner';
import Faq from '../components/faqs/Faqs';
import Head from 'next/head';


export default function Faqs() {


    return (
        <>
            <Head>
                <title>Ultimate Industrials | Faqs</title>
                <meta name="description" content=" Welcome to Construction Supplies Co. Your one-stop shop for all construction materials" />

                <meta property="og:title" content="Ultimate Industrials | Accueil" />
                <meta property="og:description" content="Your one-stop shop for all construction materials" />
                <meta property="og:image" content="../public/logo.png" />
            </Head>
            <Banner />
            <Faq />
        </>
    );
};


