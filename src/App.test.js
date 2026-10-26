import { render, screen } from '@testing-library/react';
import App from './App';
import api from './api';

jest.mock('./api', () => ({
    __esModule: true,
    default: {
        get: jest.fn()
    },
    getAuthHeaders: jest.fn(() => ({}))
}));

test('shows job listings returned by the API', async () => {
    api.get.mockResolvedValueOnce({
        data: [{
            id: 1,
            title: 'Frontend Engineer',
            company: 'Example Studio',
            location: 'Remote',
            job_type: 'Full-time',
            salary: '$80,000',
            description: 'Build accessible web experiences.'
        }]
    });

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Frontend Engineer' })).toBeInTheDocument();
    expect(screen.getByText('Example Studio')).toBeInTheDocument();
});
