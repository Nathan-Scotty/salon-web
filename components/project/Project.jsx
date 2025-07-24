import styles from './stylesheets/Project.module.css'
import Image from "next/image";
import img1 from "../../public/pexels-1.jpg";
import img2 from "../../public/pexels-2.jpg";
import img3 from "../../public/pexels-3.jpg";
import img4 from "../../public/pexels-4.jpg";
import img5 from "../../public/pexels-5.jpg";
import img6 from "../../public/pexels-6.jpg";
import img7 from "../../public/pexels-7.jpg";
import img8 from "../../public/pexels-8.jpg";
import img9 from "../../public/pexels-9.jpg";
import img10 from "../../public/pexels-10.jpg";
import { useEffect, useState } from "react";

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

export default function Project() {
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {
    const showSlides = (n) => {
      const slides = document.getElementsByClassName(styles.mySlides);
      const dots = document.getElementsByClassName(styles.demo);
      const captionText = document.getElementById("caption");
      if (!slides.length || !dots.length || !captionText) return;

      Array.from(slides).forEach(slide => (slide.style.display = "none"));
      Array.from(dots).forEach(dot => (dot.className = dot.className.replace(` ${styles.active}`, "")));

      slides[n - 1].style.display = "block";
      dots[n - 1].className += ` ${styles.active}`;
      captionText.innerHTML = dots[n - 1].alt;
    };

    showSlides(slideIndex);

    const handleScroll = () => {
      const header = document.querySelector(`.${styles.navbar}`);
      if (header) {
        header.classList.toggle(styles.scrolled, window.scrollY > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slideIndex]);

  const changeSlide = (n) => {
    setSlideIndex((prev) => {
      const newIndex = prev + n;
      return newIndex < 1 ? images.length : newIndex > images.length ? 1 : newIndex;
    });
  };

  const setCurrentSlide = (n) => setSlideIndex(n);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        {images.map((img, index) => (
          <div key={index} className={styles.mySlides} style={{ display: slideIndex === index + 1 ? "block" : "none" }}>
            <div className={styles.numbertext}>{index + 1} / {images.length}</div>
            <Image src={img} alt={`img${index + 1}`} style={{ width: '100%', height: 'auto', verticalAlign: 'middle' }} />
          </div>
        ))}

        <a className={styles.prev} onClick={() => changeSlide(-1)}>❮</a>
        <a className={styles.next} onClick={() => changeSlide(1)}>❯</a>

        <div className={styles.caption_container}>
          <p id="caption"></p>
        </div>

        <div className={styles.row}>
          {images.map((img, index) => (
            <div key={index} className={styles.column}>
              <Image
                className={`${styles.demo} ${styles.cursor}`}
                src={img}
                alt={`img${index + 1}`}
                style={{ width: '100%', height: 'auto', verticalAlign: 'middle' }}
                onClick={() => setCurrentSlide(index + 1)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
