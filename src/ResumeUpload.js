import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getAuthHeaders } from './api';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!localStorage.getItem('access_token')) {
            navigate('/login');
            return;
        }
        if (!file) {
            setError('Choose a resume file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/resume/upload/', formData, { headers: getAuthHeaders() });
            setSuccess('Your resume was uploaded successfully.');
            setFile(null);
            event.target.reset();
        } catch (uploadError) {
            console.error('Resume upload failed:', uploadError);
            const detail = uploadError.response?.data?.detail;
            setError(detail || 'Resume upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-wrap auth-layout">
            <section className="upload-card">
                <p className="eyebrow">Your profile</p>
                <h1 className="page-heading">Upload your resume</h1>
                <p>Add a resume to your profile so it is ready when you apply for a job.</p>
                {success && <p className="alert alert-success" role="status">{success}</p>}
                {error && <p className="alert" role="alert">{error}</p>}
                <form className="form-stack" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="resume-file">Resume file (PDF, DOC, or DOCX)</label>
                        <input
                            id="resume-file"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(event) => setFile(event.target.files?.[0] || null)}
                            required
                        />
                        {file && <small className="muted">Selected: {file.name}</small>}
                    </div>
                    <button className="button button-primary" type="submit" disabled={loading}>
                        {loading && <span className="spinner spinner-small" />}
                        {loading ? 'Uploading…' : 'Upload resume'}
                    </button>
                </form>
                <p className="form-note"><Link to="/dashboard">Back to my applications</Link></p>
            </section>
        </main>
    );
};

export default ResumeUpload;
