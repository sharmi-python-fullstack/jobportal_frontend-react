import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ title: '', location: '', job_type: '' });

    useEffect(() => {
        let active = true;
        const timeout = window.setTimeout(async () => {
            setLoading(true);
            setError('');

            try {
                const params = Object.fromEntries(
                    Object.entries(filters).filter(([, value]) => value.trim())
                );
                const response = await api.get('/jobs/', { params });
                if (active) {
                    setJobs(response.data);
                }
            } catch (fetchError) {
                console.error('Error fetching jobs:', fetchError);
                if (active) {
                    setError('Could not load job listings. Check your connection and try again.');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }, 250);

        return () => {
            active = false;
            window.clearTimeout(timeout);
        };
    }, [filters]);

    const handleFilterChange = (event) => {
        setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    return (
        <main className="page-wrap">
            <section className="hero">
                <p className="eyebrow">Your next chapter starts here</p>
                <h1>Find work that works for you.</h1>
                <p className="hero-copy">
                    Explore opportunities from teams looking for people like you.
                    Search by role, location, or the way you want to work.
                </p>
            </section>

            <section aria-labelledby="jobs-heading">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">Opportunities</p>
                        <h2 className="page-heading" id="jobs-heading">Job listings</h2>
                    </div>
                    {!loading && !error && (
                        <p className="muted">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found</p>
                    )}
                </div>

                <div className="filter-panel">
                    <div className="field">
                        <label htmlFor="job-title">Job title or keyword</label>
                        <input
                            id="job-title"
                            className="filter-control"
                            name="title"
                            placeholder="e.g. Frontend developer"
                            value={filters.title}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="job-location">Location</label>
                        <input
                            id="job-location"
                            className="filter-control"
                            name="location"
                            placeholder="Any location"
                            value={filters.location}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="job-type">Job type</label>
                        <select
                            id="job-type"
                            className="filter-control"
                            name="job_type"
                            value={filters.job_type}
                            onChange={handleFilterChange}
                        >
                            <option value="">All types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="status-message" role="status"><span className="spinner" />Finding the right opportunities…</p>
                ) : error ? (
                    <p className="alert" role="alert">{error}</p>
                ) : jobs.length ? (
                    <div className="job-grid">
                        {jobs.map((job) => (
                            <article key={job.id} className="job-card">
                                <div className="job-card-top">
                                    <div className="company-avatar" aria-hidden="true">
                                        {(job.company || 'J').trim().charAt(0).toUpperCase()}
                                    </div>
                                    <span className="job-type">{job.job_type}</span>
                                </div>
                                <div>
                                    <h3><Link className="job-title-link" to={`/jobs/${job.id}`}>{job.title}</Link></h3>
                                    <p className="company-name">{job.company}</p>
                                </div>
                                <div className="job-meta">
                                    <span>{job.location}</span>
                                    {job.salary && <span>{job.salary}</span>}
                                </div>
                                <p className="job-description">{job.description}</p>
                                <div className="job-card-footer">
                                    <span className="salary">{job.salary || 'Salary not specified'}</span>
                                    <Link className="button button-outline" to={`/jobs/${job.id}`}>View details</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>No jobs match your search yet</h3>
                        <p>Try changing your filters or check back soon.</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default JobList;
