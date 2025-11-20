import styles from "./stylesheets/AppointmentForm.module.css";
import { FormattedMessage } from "react-intl";

export default function AppointmentForm() {

  const handleSubmit = async () => {

  };

  return (
    <div className={styles.main}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}><FormattedMessage id='appointment.title'/></h2>
        <iframe
          title="Service and Schedule Info"
          src="https://calendly.com/qualitechoisie13/nouvelles-disponibilites"
          width="100%"
          height="700"
          frameBorder="0">
        </iframe>
      </form>
    </div>
  );
}
