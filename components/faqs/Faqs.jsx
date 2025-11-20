import { useState } from "react";
import styles from "./stylesheets/Faqs.module.css"
import { FormattedMessage } from "react-intl";

export default function Faqs() {

    const faqs = {
        General: [
            {
                question: "general.question.services",
                answer: "general.answer.services",
            },
            {
                question: "general.question.appointment",
                answer: "general.answer.appointment",
            },
        ],
        "Quality & Satisfaction": [
            {
                question: "quality.question.quality",
                answer: "quality.answer.quality",
            },
            {
                question: "quality.question.unsatisfied",
                answer: "quality.answer.unsatisfied",
            },
        ],
        "Our Services": [
            {
                question: "services.question.damagedHair",
                answer: "services.answer.damagedHair",
            },
            {
                question: "services.question.events",
                answer: "services.answer.events",
            },
            {
                question: "services.question.advice",
                answer: "services.answer.advice",
            },
        ],
        Payment: [
            {
                question: "payment.question.methods",
                answer: "payment.answer.methods",
            },
            {
                question: "payment.question.packages",
                answer: "payment.answer.packages",
            },
        ],
    };

    const [selectedCategory, setSelectedCategory] = useState('General');

    return <>
        <div className={styles.container}>
            <div className={styles.headerHH}>
                <h1><FormattedMessage id="query"/></h1>
                <h2><FormattedMessage id="faqs.title"/></h2>
            </div>
            <div className={styles.content}>
                <aside className={styles.sidebar}>
                    <h3><FormattedMessage id="categories"/></h3>
                    <ul>
                        {Object.keys(faqs).map((category, index) => (
                            <li key={index} onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? styles.active : ''}>
                                {category} ({faqs[category].length})
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className={styles.main}>
                    {faqs[selectedCategory].map((faq, index) => (
                        <div key={index} className={styles.faqItem}>
                            <h3 className={styles.question}><FormattedMessage id={faq.question} /></h3>
                            <p className={styles.answer}><FormattedMessage id={faq.answer} /></p>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    </>
}