import styles from './stylesheets/Signup.module.css';
import Image from 'next/image';
import pixel5 from '../../public/avatar.jpg'
import { useState } from 'react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [phone, setPhone] = useState('');

    const handleCancel = () => {
        setEmail("")
        setName("")
        setPasswordHash("")
        setPhone("")
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name || !email || !passwordHash || !phone) {
            console.error("All fields are required")
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            console.error("Invalid email address")
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, passwordHash, phone, role: 'ADMIN' })
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('userId', data.id);
                localStorage.setItem('authToken', data.token)

                window.location.href = '/signin'
            } else {
                const errorData = await response.json()
                console.error("Registration failed: ", errorData)
            }

        } catch (error) {
            console.error("An error occured. Please try again.")
        }
    }

    return (
        <div className={styles.body}>
            <form onSubmit={handleSignup} className={styles.form}>
                <div className={styles.imgcontainer}>
                    <Image
                        src={pixel5}
                        alt="Avatar"
                        className={styles.avatar}
                        width={100}
                        height={100}
                    />
                </div>

                <div className={styles.container}>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label >Email</label>
                    <input
                        type="email"
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={passwordHash}
                        onChange={(e) => setPasswordHash(e.target.value)}
                        required
                    />

                    <label>Phone</label>
                    <input
                        type="tel"
                        placeholder="Enter Your Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <button type="submit">Signup</button>
                </div>

                <div className={styles.container}>
                    <button onClick={handleCancel} className={styles.cancelbtn}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
