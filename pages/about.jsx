import Banner from '../components/about/Banner'
import AboutUs from '../components/about/AboutUs'
import Expert from '../components/about/Expert'
import Head from 'next/head'

export default function About() {
    return (
        <>
            <Head>
                <title>DHB Davilas Hair & Beauty | About</title>
                <meta name="description" content="Welcome to Davilas Hair & Beauty – Experience the best hair care and styling services tailored to your needs." />

                <meta property="og:title" content="DHB-Davilas Hair & Beauty | About" />
                <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
                <meta property="og:image" content="/davilas_logo.png" />
            </Head>
            <Banner />
            <AboutUs />
            <Expert />
        </>
    )
}
