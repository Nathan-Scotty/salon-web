import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './stylesheets/TestimonialsSlider.module.css';
import profile from '../../public/profile.jpg';

const TestimonialsSlider = () => {
  const testimonials = [
    { text: "I just love their design for all stunning details.", author: "John Doe", image: profile, title: "Loyal Customer", stars: 5 },
    { text: "I just love their design for all stunning details.", author: "Jane Smith", image: profile, title: "Loyal Customer", stars: 4 },
    { text: "I just love their design for all stunning details.", author: "Sam Johnson", image: profile, title: "Loyal Customer", stars: 5 },
    { text: "Amazing service and quality!", author: "Alice Brown", image: profile, title: "Happy Client", stars: 5 },
    { text: "Best experience ever!", author: "Robert White", image: profile, title: "Satisfied Customer", stars: 4 },
  ];

  const [currentIndex, setCurrentIndex] = useState(2);
  const [newComment, setNewComment] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [commentsList, setCommentsList] = useState(testimonials);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (commentsList.length - 2) + 2);
    }, 3000);
    return () => clearInterval(interval);
  }, [commentsList]);

  const handleCommentChange = (e) => setNewComment(e.target.value);
  const handleAuthorChange = (e) => setNewAuthor(e.target.value);
  const handleRatingChange = (e) => setNewRating(Number(e.target.value));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment && newRating > 0) {
      const newTestimonial = {
        text: newComment,
        author: newAuthor,
        image: profile,
        title: "Customer",
        stars: newRating,
      };
      setCommentsList([newTestimonial, ...commentsList]);
      setNewComment("");
      setNewAuthor("");
      setNewRating(0);
    }
  };

  return (
    <div className={styles.testimonials_list}>
      <div className={styles.static_comments}>
        {commentsList.slice(0, 2).map((testimonial, index) => (
          <div key={index} className={styles.testimonial}>
            <p className={styles.testimonial_text}>{testimonial.text}</p>
            <div style={{ display: 'flex' }}>
              <Image src={testimonial.image} style={{ width: '50px', height: 'auto', padding: '0 10px' }} alt={testimonial.author} />
              <div>
                <h3 className={styles.testimonial_author}>- {testimonial.author}</h3>
                <p className={styles.title}>{testimonial.title}</p>
                <div className={styles.stars}>
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <span key={i} className={styles.star}>★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex} 
          className={styles.testimonial}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <p className={styles.testimonial_text}>{commentsList[currentIndex].text}</p>
          <div style={{ display: 'flex' }}>
            <Image src={commentsList[currentIndex].image} style={{ width: '50px', height: 'auto', padding: '0 10px' }} alt={commentsList[currentIndex].author} />
            <div>
              <h3 className={styles.testimonial_author}>- {commentsList[currentIndex].author}</h3>
              <p className={styles.title}>{commentsList[currentIndex].title}</p>
              <div className={styles.stars}>
                {[...Array(commentsList[currentIndex].stars)].map((_, i) => (
                  <span key={i} className={styles.star}>★</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* New Comment Form */}
      <motion.div 
        className={styles.comment_form}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input 
          type="text"
          value={newAuthor}
          onChange={handleAuthorChange}
          placeholder='Name'
          className={styles.author_input}
        />
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Write your comment..."
          className={styles.comment_input}
        />
        <div className={styles.rating}>
          <label>Rating: </label>
          {[1, 2, 3, 4, 5].map((rating) => (
            <input
              key={rating}
              type="radio"
              name="rating"
              value={rating}
              checked={newRating === rating}
              onChange={handleRatingChange}
            />
          ))}
        </div>
        <button onClick={handleSubmit} className={styles.submit_button}>Submit</button>
      </motion.div>
    </div>
  );
};

export default TestimonialsSlider;
