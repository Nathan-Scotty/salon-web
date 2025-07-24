import styles from './stylesheets/Expert.module.css';
import Image from 'next/image'
import Link from 'next/link'
import profile from '../../public/profile.jpg'
import TestimonialsSlider from './TestimonialsSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';


export default function Expert() {

    return <>
        <section className={styles.slider}>
            <h2>Testimonials</h2>
            <h4>Customer's Feedback</h4>
            <TestimonialsSlider />
        </section>
    </>
}