import Banner from '../components/contact/Banner'
import Contacts from '../components/contact/Contact'
import Head from 'next/head'

export default function Contact() {
    return (
        <>
            <Head>
                <title>DHB Davilas Hair & Beauty | Contact</title>
                <meta name="description" content="Welcome to Davilas Hair & Beauty – Experience the best hair care and styling services tailored to your needs." />

                <meta property="og:title" content="DHB-Davilas Hair & Beauty | Contact" />
                <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
                <meta property="og:image" content="/davilas_logo.png" />
            </Head>
            <Banner />
            <Contacts />
        </>
    )
}
