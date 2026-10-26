import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from './api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/token/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            navigate('/dashboard');
        } catch (loginError) {
            console.error('Login failed:', loginError);
            setError('Login failed. Check your username and password, then try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-wrap auth-layout">
            <section className="auth-card">
                <p className="eyebrow">Welcome back</p>
                <h1>Log in</h1>
                <p>Sign in to manage your applications and resume.</p>
                {message && <p className="alert alert-success" role="status">{message}</p>}
                {error && <p className="alert" role="alert">{error}</p>}
                <form className="form-stack" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="username">Username</label>
                        <input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    </div>
                    <button className="button button-primary" type="submit" disabled={loading}>
                        {loading && <span className="spinner spinner-small" />}
                        {loading ? 'Signing in…' : 'Log in'}
                    </button>
                </form>
                <p className="form-note">New to CareerLane? <Link to="/register">Create an account</Link></p>
            </section>
        </main>
    );
};

export default Login;
