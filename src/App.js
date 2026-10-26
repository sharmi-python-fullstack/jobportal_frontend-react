import React from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import JobDetail from './JobDetail';
import JobList from './JobList';
import Login from './Login';
import Register from './Register';
import ResumeUpload from './ResumeUpload';
import UserDashboard from './UserDashboard';

function SiteLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <>
            <header className="site-header" data-route={location.pathname}>
                <nav className="site-nav" aria-label="Main navigation">
                    <Link className="brand" to="/">
                        <span className="brand-mark">J</span>
                        <span>Career<span className="brand-accent">Lane</span></span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/">Find jobs</Link>
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard">My applications</Link>
                                <Link to="/resume-upload">Resume</Link>
                                <button className="button button-quiet nav-action" onClick={handleLogout}>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Log in</Link>
                                <Link className="button button-primary nav-action" to="/register">
                                    Create account
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<JobList />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/resume-upload" element={<ResumeUpload />} />
                <Route path="*" element={<main className="page-wrap"><section className="empty-state"><h1>Page not found</h1><Link to="/">Browse jobs</Link></section></main>} />
            </Routes>

            <footer className="site-footer">
                <div className="footer-inner">
                    <span>CareerLane</span>
                    <span>Find work that moves you forward.</span>
                </div>
            </footer>
        </>
    );
}

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <SiteLayout />
        </BrowserRouter>
    );
}

export default App;
