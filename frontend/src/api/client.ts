import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true, // Important for HTTP-only cookies
});

// Optionally add interceptors here
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors, e.g., 401 Unauthorized redirect
    if (error.response?.status === 401) {
      // Redirect or handle auth state
    }
    return Promise.reject(error);
  }
);
