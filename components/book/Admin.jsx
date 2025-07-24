import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './stylesheets/Admin.module.css'


export default function AdminAvailability() {
    const [date, setDate] = useState("");
    const [startHour, setStartHour] = useState("");
    const [endHour, setEndHour] = useState("");
    const [maxAppointments, setMaxAppointments] = useState(1);
    const [message, setMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole");

        if (!token || role !== 'ADMIN') {
            router.push("/signin");
        } else {
            setIsAdmin(true)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("")

        try {
            const response = await fetch("http://localhost:5000/api/admin", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date, startHour, endHour, maxAppointments: parseInt(maxAppointments, 10),
                })
            })

            console.log("response: ",response)

            if (response.ok) {
                setMessage("✅ Availability successfully saved!")
                setDate("");
                setStartHour("");
                setEndHour("");
                setMaxAppointments(1);
            } else {
                const error = await response.json();
                setMessage(`❌ ${error.message || "Something went wrong."}`)
            }
        } catch (error) {
            console.error(error)
            setMessage('❌ Server error')
        }
    }
    if (!isAdmin) return null;

    return (
        <div className={styles.availabilityWrapper}>
            <form onSubmit={handleSubmit} className={styles.availabilityForm}>
                <h2>Set Availability</h2>

                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <label>Start Hour</label>
                <input
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    required
                />

                <label>End Hour</label>
                <input
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    required
                />

                <label>Max Appointments</label>
                <input
                    type="number"
                    min="1"
                    value={maxAppointments}
                    onChange={(e) => setMaxAppointments(e.target.value)}
                    required
                />

                <button type="submit">Save Availability</button>

                {message && <p className={styles.statusMessage}>{message}</p>}
            </form>
        </div>
    )
}