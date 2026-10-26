import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getAuthHeaders } from './api';

const UserDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        const fetchApplications = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await api.get('/my-applications/', {
                    headers: getAuthHeaders()
                });
                if (active) {
                    setApplications(response.data);
                }
            } catch (fetchError) {
                console.error('Failed to fetch applications:', fetchError);
                if (active) {
                    setError('Failed to load your applications. Please try again.');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchApplications();
        return () => {
            active = false;
        };
    }, [navigate]);

    if (loading) {
        return <main className="page-wrap"><p className="status-message"><span className="spinner" />Loading your applications…</p></main>;
    }

    return (
        <main className="page-wrap">
            <section className="dashboard-card">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">Your job search</p>
                        <h1 className="page-heading">My applications</h1>
                    </div>
                    <Link className="button button-outline" to="/resume-upload">Manage resume</Link>
                </div>

                {error ? (
                    <p className="alert" role="alert">{error}</p>
                ) : applications.length > 0 ? (
                    <div className="dashboard-list">
                        {applications.map((application) => (
                            <article className="application-item" key={application.id}>
                                <h3>
                                    <Link className="job-title-link" to={`/jobs/${application.job.id}`}>
                                        {application.job.title}
                                    </Link>
                                </h3>
                                <p>{application.job.company} · {application.job.location}</p>
                                <p>Applied on {new Date(application.applied_at).toLocaleDateString()}</p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h2>You haven’t applied to any jobs yet</h2>
                        <p>Find an opportunity that fits and your applications will appear here.</p>
                        <Link className="button button-primary" to="/">Browse jobs</Link>
                    </div>
                )}
            </section>
        </main>
    );
};

export default UserDashboard;
