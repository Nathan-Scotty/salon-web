'use client';

import { useState } from 'react';
import styles from './stylesheets/Expert.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebook,
    faTwitter,
    faLinkedin,
    faInstagram,
    faStar,
    faStarHalfAlt,
} from '@fortawesome/free-solid-svg-icons';

const FORMSPREE_REVIEW_ENDPOINT = 'https://formspree.io/f/xovynwao'; // Change this or create a new form!

export default function Expert() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a star rating');
            return;
        }

        setStatus('sending');

        const data = {
            name,
            rating,
            comment,
            _subject: `New Review ★${rating} from ${name}`,
        };

        try {
            const res = await fetch(FORMSPREE_REVIEW_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (res.ok) {
                setStatus('success');
                setName('');
                setComment('');
                setRating(0);
                setTimeout(() => setStatus('idle'), 5000);
            } else throw new Error();
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 6000);
        }
    };

    return (
        <>
            {/* NEW: Leave a Review Section */}
            <section className={styles.reviewSection}>
                <div className={styles.reviewCard}>
                    <h3>Share Your Experience With Us</h3>
                    <p>We'd love to hear how your visit went!</p>

                    <form onSubmit={handleSubmit} className={styles.reviewForm}>
                        {/* Star Rating */}
                        <div className={styles.starRating}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`${styles.star} ${star <= (hover || rating) ? styles.filled : ''
                                        }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    <FontAwesomeIcon icon={faStar} />
                                </button>
                            ))}
                            <span className={styles.ratingText}>
                                {rating === 0 ? 'Click a star' : `${rating} Star${rating > 1 ? 's' : ''}`}
                            </span>
                        </div>

                        {/* Name */}
                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={styles.input}
                        />

                        {/* Comment */}
                        <textarea
                            placeholder="Tell us about your experience... (optional but appreciated)"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className={styles.textarea}
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className={styles.submitReviewBtn}
                        >
                            {status === 'sending' ? 'Sending...' : 'Submit Review'}
                        </button>

                        {/* Success / Error Message */}
                        {status === 'success' && (
                            <p className={styles.successMsg}>
                                Thank you for your review! It will appear soon.
                            </p>
                        )}
                        {status === 'error' && (
                            <p className={styles.errorMsg}>
                                Something went wrong. Please try again.
                            </p>
                        )}
                    </form>
                </div>
            </section>
        </>
    );
}