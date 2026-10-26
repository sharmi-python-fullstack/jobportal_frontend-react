import axios from 'axios';

const api = axios.create({
    baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '')
});

export const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default api;
