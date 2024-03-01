import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_URL
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
