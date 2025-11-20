import Banner from "../components/book/Banner"
import Head from "next/head"
import AppointmentForm from "../components/book/AppointmentForm"

export default function Booking() {

    return (
        <>
            <Head>
                <title>DHB Davilas Hair & Beauty | Book</title>
                <meta name="description" content="Welcome to Davilas Hair & Beauty – Experience the best hair care and styling services tailored to your needs." />

                <meta property="og:title" content="DHB-Davilas Hair & Beauty | Book" />
                <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
                <meta property="og:image" content="/davilas_logo.png" />
            </Head>
            <Banner />
            <AppointmentForm />
        </>
    )
}