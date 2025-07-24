import BookingTeaser from "../components/book/Booking"
import Banner from "../components/book/Banner"
import Head from "next/head"

export default function Booking() {

    return (
        <>
            <Head>
                <title>Luxury Hair Salon | Home</title>
                <meta name="description" content="Welcome to Luxury Hair Salon – Experience the best hair care and styling services tailored to your needs." />

                <meta property="og:title" content="Luxury Hair Salon | Home" />
                <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
                <meta property="og:image" content="../public/salon-logo.png" />
            </Head>
            <Banner/>
            <BookingTeaser/>
        </>
    )
}