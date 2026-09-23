import axios from 'axios'

// Using the API address from .env and localhost if API is not working
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// create an Axios setup we will reuse
const axiosInstance = axios.create ({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json', }, // tells the backend we are sending JSON data
});

// Run this before sending each request
axiosInstance.interceptors.request.use(
    (config) => {
        // get the saved login token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    // pass the request error back to the calling code.
    (error) => Promise.reject(error)
);

// Run this when a response comes back
axiosInstance.interceptors.response.use(
    // return successful response.
    (Response) => Response,
    (error) => {
        // Check whether the backend sent an error response
        if (error.response) {
            return Promise.reject(new Error(error.response.data?.message || error.message));
        }
        // pass back other errors, such as a connection problem.
        return Promise.reject(error);
    }
);

export default axiosInstance