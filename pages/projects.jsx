import Banner from "../components/project/Banner";
import Project from "../components/project/Project";
import Head from "next/head";


export default function Projects() {


    return <>
        <Head>
            <title>DHB Davilas Hair & Beauty | Project</title>
            <meta name="description" content="Welcome to Davilas Hair & Beauty – Experience the best hair care and styling services tailored to your needs." />

            <meta property="og:title" content="DHB-Davilas Hair & Beauty | project" />
            <meta property="og:description" content="Experience the best hair care and styling services tailored to your needs." />
            <meta property="og:image" content="/davilas_logo.png" />
        </Head>
        <Banner />
        <Project />
    </>
}