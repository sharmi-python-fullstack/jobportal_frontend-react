import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/register/', { username, email, password });
            navigate('/login', { state: { message: 'Your account is ready. Please log in.' } });
        } catch (registrationError) {
            console.error('Registration failed:', registrationError);
            if (!registrationError.response) {
                setError('Cannot reach the server. Start Django with "python manage.py runserver" and try again.');
                return;
            }

            const details = registrationError.response?.data;
            const firstError = details && Object.values(details).flat()[0];
            setError(
                firstError ||
                details?.detail ||
                'Registration failed. Please check your details and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-wrap auth-layout">
            <section className="auth-card">
                <p className="eyebrow">Get started</p>
                <h1>Create your account</h1>
                <p>Join CareerLane and keep your job search organized.</p>
                {error && <p className="alert" role="alert">{error}</p>}
                <form className="form-stack" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="username">Username</label>
                        <input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email address</label>
                        <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" autoComplete="new-password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    </div>
                    <button className="button button-primary" type="submit" disabled={loading}>
                        {loading && <span className="spinner spinner-small" />}
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>
                <p className="form-note">Already registered? <Link to="/login">Log in</Link></p>
            </section>
        </main>
    );
};

export default Register;
