import { useState } from "react";
import styles from "./stylesheets/Faqs.module.css"

export default function Faqs() {

    const faqs = {
        General: [
            {
                question: "Quels services de construction proposez-vous ?",
                answer: "Nous proposons des services de construction résidentielle, commerciale et industrielle, incluant la planification, la gestion de projet, la rénovation et bien plus."
            },
            {
                question: "Quelle est votre expérience dans le domaine de la construction ?",
                answer: "Nous avons plus de 20 ans d'expérience dans le domaine de la construction, avec une équipe de professionnels qualifiés et certifiés."
            }
        ],
        "Quality & Satisfaction": [
            {
                question: "Comment garantissez-vous la qualité de vos travaux ?",
                answer: "Nous suivons des normes strictes et effectuons des contrôles de qualité réguliers pour garantir des résultats de haute qualité."
            },
            {
                question: "Que faire si je ne suis pas satisfait du travail effectué ?",
                answer: "Nous nous engageons à rectifier toute situation pour assurer la satisfaction complète de nos clients."
            }
        ],
        "Our Services": [
            {
                question: "Offrez-vous des services de rénovation ?",
                answer: "Oui, nous offrons des services de rénovation pour les maisons, bureaux et bâtiments industriels."
            },
            {
                question: "Pouvez-vous gérer des projets de grande envergure ?",
                answer: "Absolument, nous avons l'expertise et les ressources nécessaires pour gérer des projets de toute taille."
            },
            {
                question: "Proposez-vous des services de conception architecturale ?",
                answer: "Oui, nous offrons des services complets de conception architecturale pour tous types de projets."
            }
        ],
        Payment: [
            {
                question: "Quel est votre système de paiement ?",
                answer: "Nous acceptons les virements bancaires, les paiements par carte de crédit et les chèques."
            }
        ]
    };

    const [selectedCategory, setSelectedCategory] = useState('General');

    return <>
        <div className={styles.container}>
            <div className={styles.headerHH}>
                <h1>YOUR QUERY</h1>
                <h2>Frequently Asked Questions</h2>
            </div>
            <div className={styles.content}>
                <aside className={styles.sidebar}>
                    <h3>Categories</h3>
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
                            <h3 className={styles.question}>{faq.question}</h3>
                            <p className={styles.answer}>{faq.answer}</p>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    </>
}