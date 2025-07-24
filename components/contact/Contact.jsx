import styles from './stylesheets/Contact.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faEnvelope, faPhone, faClock } from '@fortawesome/free-solid-svg-icons'

export default function Contact() {
    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11047.702194363234!2d-75.72779662341442!3d45.47654740109582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce041e3adcb7e3%3A0xa3e2e29a405bb7d4!2sGatineau%2C%20QC%2C%20Canada!5e0!3m2!1sen!2sca!4v1711234567890!5m2!1sen!2sca"
                    width="600"
                    height="450"
                    allowFullScreen=""
                    loading="lazy"
                    className={styles.map}
                ></iframe>
            </div>

            <div className={styles.details}>
                <div className={styles.contactDetails}>
                    <h2>Contact Us</h2>
                    <h3>Get In Touch</h3>
                    <p>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                        <span className={styles.bold}>ADDRESS:</span> Canada, Gatineau
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                        <span className={styles.bold}>EMAIL:</span>
                        <Link href="mailto:example@mail.com" className={styles.getintouch}> example@mail.com</Link>
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faPhone} className={styles.icon} />
                        <span className={styles.bold}>CALL US:</span>
                        <Link href="tel:+243123456789" className={styles.getintouch}> +243123456789</Link>
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faClock} className={styles.icon} />
                        <span className={styles.bold}>OFFICE TIME:</span> Monday to Friday 9:00am - 6:00pm
                    </p>
                </div>

                <div className={styles.contactFormContainer}>
                    <h2>Send Us a Message</h2>
                    <form action="#" method="post">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" placeholder="Your name.." required />

                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Your email.." required />

                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subject" placeholder="Subject.." required />

                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" placeholder="Write your message here.." required></textarea>

                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        </div>
    )
}
