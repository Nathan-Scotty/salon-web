'use client';

import { useState } from 'react';
import styles from './stylesheets/Contact.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faEnvelope,
    faPhone,
    faClock,
    faCheckCircle,
    faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { FormattedMessage } from "react-intl";

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meodepkv';

export default function Contact() {
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const limits = {
        name: { min: 2, max: 30 },
        subject: { min: 3, max: 50 },
        message: { min: 10, max: 500 },
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'name':
                if (!value.trim()) error = 'Name is required';
                else if (value.length < limits.name.min) error = `Name must be at least ${limits.name.min} characters`;
                else if (value.length > limits.name.max) error = `Name must be under ${limits.name.max} characters`;
                else if (!/^[a-zA-Z\s'-]+$/.test(value)) error = 'Name can only contain letters, spaces, hyphens, and apostrophes';
                break;

            case 'email':
                if (!value) error = 'Email is required';
                else if (!/^\S+@\S+\.\S+$/.test(value)) error = 'Please enter a valid email';
                break;

            case 'subject':
                if (!value.trim()) error = 'Subject is required';
                else if (value.length < limits.subject.min) error = `Subject must be at least ${limits.subject.min} characters`;
                else if (value.length > limits.subject.max) error = `Subject must be under ${limits.subject.max} characters`;
                break;

            case 'message':
                if (!value.trim()) error = 'Message is required';
                else if (value.length < limits.message.min) error = `Message must be at least ${limits.message.min} characters`;
                else if (value.length > limits.message.max) error = `Message must be under ${limits.message.max} characters`;
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]); // ← Fixed: No 'as keyof'
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setStatus('sending');
        setMessage('');

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formDataToSend,
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Thank you! Your message has been sent.');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setErrors({});
            } else {
                throw new Error();
            }
        } catch {
            setStatus('error');
            setMessage('Failed to send. Please try again.');
        }
    };

    return (
        <div className={styles.container}>

            <div className={styles.details}>

                {/* CONTACT DETAILS */}
                <div className={styles.contactDetails}>
                    <h2><FormattedMessage id="contact.title" /></h2>
                    <h3><FormattedMessage id="contact.subtitle" /></h3>

                    <p>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                        <FormattedMessage id="contact.address.value" />
                    </p>

                    <p>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                        <Link href="mailto:davilasbarack@gmail.com" className={styles.getintouch}>
                            davilasbarack@gmail.com
                        </Link>
                    </p>

                    <p>
                        <FontAwesomeIcon icon={faPhone} className={styles.icon} />
                        <Link href="tel:+243123456789" className={styles.getintouch}>
                            +1 613-710-0754
                        </Link>
                    </p>

                    <p>
                        <FontAwesomeIcon icon={faClock} className={styles.icon} />
                        <FormattedMessage id="contact.hours.value"/>
                    </p>

                    <h3><FormattedMessage id="contact.socials"/></h3>

                    <p>
                        <FontAwesomeIcon icon={faFacebook} className={styles.icon} />
                        <Link href="https://www.facebook.com/share/1A9zPkKrVz/?mibextid=wwXIfr" className={styles.getintouch}>
                            Facebook
                        </Link>
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faInstagram} className={styles.icon} />
                        <Link href="https://instagram.com" className={styles.getintouch}>
                            Instagram
                        </Link>
                    </p>
                </div>

                {/* CONTACT FORM */}
                <div className={styles.contactFormContainer}>
                    <h2><FormattedMessage id="contact.form.title" /></h2>

                    {status === 'success' && (
                        <div className={styles.alertSuccess}>
                            <FontAwesomeIcon icon={faCheckCircle} /> {message}
                        </div>
                    )}
                    {status === 'error' && (
                        <div className={styles.alertError}>
                            <FontAwesomeIcon icon={faExclamationCircle} /> {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* NAME */}
                        <div className={styles.field}>
                            <label htmlFor="name">
                                <FormattedMessage id="contact.form.name" />
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name.."
                                required
                                disabled={status === 'sending'}
                                className={errors.name ? styles.inputError : ''}
                            />
                            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                            <span className={styles.counter}>
                                {formData.name.length}/{limits.name.max}
                            </span>
                        </div>

                        {/* EMAIL */}
                        <div className={styles.field}>
                            <label htmlFor="email">
                                <FormattedMessage id="contact.form.email" />
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your email.."
                                required
                                disabled={status === 'sending'}
                                className={errors.email ? styles.inputError : ''}
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>

                        {/* SUBJECT */}
                        <div className={styles.field}>
                            <label htmlFor="subject">
                                <FormattedMessage id="contact.form.subject" />
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Subject.."
                                required
                                disabled={status === 'sending'}
                                className={errors.subject ? styles.inputError : ''}
                            />
                            {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
                            <span className={styles.counter}>
                                {formData.subject.length}/{limits.subject.max}
                            </span>
                        </div>

                        {/* MESSAGE */}
                        <div className={styles.field}>
                            <label htmlFor="message">
                                <FormattedMessage id="contact.form.message" />
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here.."
                                required
                                rows={5}
                                disabled={status === 'sending'}
                                className={errors.message ? styles.inputError : ''}
                            ></textarea>
                            {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                            <span className={styles.counter}>
                                {formData.message.length}/{limits.message.max} (min {limits.message.min})
                            </span>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? (
                                <FormattedMessage id="contact.form.sending" />
                            ) : (
                                <FormattedMessage id="contact.form.send" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
};
