import styles from './stylesheets/Signin.module.css';
import Image from 'next/image';
import Link from 'next/link';
import pixel5 from '../../public/avatar.jpg'
import { useState } from 'react';

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCancel = () => {
        setEmail("");
        setPassword("");
    }

    const handleSignin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                // Décoder le token pour extraire l'ID utilisateur
                const payload = JSON.parse(atob(token.split(".")[1])); // Décodage du JWT
                const userId = payload.id;
                const role = payload.role;

                if (!userId) {
                    console.error("User ID is missing in token");
                    return;
                }

                console.log("Extracted userId:", userId);

                // Stocker l'ID utilisateur dans localStorage
                localStorage.setItem('userId', userId);
                localStorage.setItem('authToken', token);
                localStorage.setItem('userRole', role);

                // Redirect based on role
                if (role === 'ADMIN') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/booking';
                }
            }
        } catch (error) {
            console.error("An error occured. Please try again.")
        }
    }

    return (
        <div className={styles.body}>
            <form onSubmit={handleSignin} className={styles.form}>
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

                    <button type="submit">Login</button>
                </div>

                <div className={styles.container}>
                    <button onClick={handleCancel} className={styles.cancelbtn}>Cancel</button>
                    <Link href="/signup" className={styles.signupLink}>Don't have an account? Sign up here</Link>
                    <span className={styles.psw}>Forgot <Link href="">password?</Link></span>
                </div>
            </form>
        </div>
    )
}
