import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getAuthHeaders } from './api';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        let active = true;

        const fetchJob = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get(`/jobs/${id}/`);
                if (active) {
                    setJob(response.data);
                }
            } catch (fetchError) {
                console.error('Error fetching job details:', fetchError);
                if (active) {
                    setError('This job could not be loaded. It may have been removed.');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchJob();
        return () => {
            active = false;
        };
    }, [id]);

    const handleApply = async () => {
        if (!localStorage.getItem('access_token')) {
            navigate('/login');
            return;
        }

        setApplying(true);
        setError('');
        setNotice('');
        try {
            await api.post('/apply/', { job_id: id }, { headers: getAuthHeaders() });
            setNotice('Your application was submitted successfully.');
        } catch (applyError) {
            console.error('Unable to submit application:', applyError);
            const detail = applyError.response?.data?.detail;
            setError(detail || 'Your application could not be submitted. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return <main className="page-wrap"><p className="status-message"><span className="spinner" />Loading job details…</p></main>;
    }

    if (error && !job) {
        return <main className="page-wrap"><p className="alert" role="alert">{error}</p><p><Link className="inline-link" to="/">Back to jobs</Link></p></main>;
    }

    return (
        <main className="page-wrap">
            <p className="eyebrow"><Link className="inline-link" to="/">← All jobs</Link></p>
            <article className="detail-card">
                <div className="job-card-top">
                    <div className="company-avatar" aria-hidden="true">
                        {(job.company || 'J').trim().charAt(0).toUpperCase()}
                    </div>
                    <span className="job-type">{job.job_type}</span>
                </div>
                <h1>{job.title}</h1>
                <p className="company-name">{job.company}</p>
                <div className="job-meta">
                    <span>{job.location}</span>
                    {job.salary && <span>{job.salary}</span>}
                </div>
                <hr className="divider" />
                <h2>About this role</h2>
                <p className="detail-copy">{job.description}</p>
                {notice && <p className="alert alert-success" role="status">{notice}</p>}
                {error && <p className="alert" role="alert">{error}</p>}
                <div className="detail-actions">
                    <button className="button button-primary" onClick={handleApply} disabled={applying}>
                        {applying && <span className="spinner spinner-small" />}
                        {applying ? 'Submitting…' : 'Apply for this job'}
                    </button>
                    <Link className="button button-outline" to="/resume-upload">Upload your resume</Link>
                </div>
            </article>
        </main>
    );
};

export default JobDetail;
