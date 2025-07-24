import Link from "next/link";
import styles from "./stylesheets/Booking.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AppointmentForm() {
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [service, setService] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
    } else {
      setIsAuth(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch("http://localhost:5000/api/appointment", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, date, hour, service }),
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        router.push('/signin');
        return;
      }

      if (response.ok) {
        setMessage('🎉 Appointment successfully booked!');
        setDate('');
        setHour('');
        setService('');
      } else {
        const error = await response.json()
        setMessage(`❌ ${error.message}` || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage('❌ Server error, please try again.');
    }
  };

  if (!isAuth) return null;

  return (
    <div className={styles.bookingWrapper}>
      <form onSubmit={handleSubmit} className={styles.bookingTeaser}>
        <h2>Book an Appointment</h2>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Hour</label>
        <input
          type="time"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          required
        />

        <label>Service</label>
        <select value={service} onChange={(e) => setService(e.target.value)} required>
          <option value="">Select a service</option>
          <option value="Haircuts">Haircuts</option>
          <option value="Hair Extensions">Hair Extensions</option>
          <option value="Styling">Styling</option>
          <option value="Add-On Services">Add-On Services</option>
        </select>

        <button type="submit">Book Now</button>

        {message && <p className={styles.statusMessage}>{message}</p>}
      </form>
    </div>
  );
}