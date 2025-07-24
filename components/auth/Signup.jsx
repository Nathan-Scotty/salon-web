import styles from './stylesheets/Signup.module.css';
import Image from 'next/image';
import pixel5 from '../../public/avatar.jpg'
import { useState } from 'react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPsw, setConfirmPsw] = useState('');

    const handleCancel = () => {
        setEmail("")
        setName("")
        setPassword("")
        setConfirmPsw("")
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPsw) {
            console.error("All fields are required")
            return;
        }

        if (password !== confirmPsw) {
            console.error("Passwords don't macth")
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
                body: JSON.stringify({ name, email, password, confirmPassword: confirmPsw })
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label>Confirm</label>
                    <input
                        type="password"
                        placeholder="Confirm Your Password"
                        value={confirmPsw}
                        onChange={(e) => setConfirmPsw(e.target.value)}
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
