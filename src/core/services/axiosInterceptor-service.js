import axios from 'axios';
const axiosInstance = axios.create();

const token = localStorage.getItem('authToken');

axiosInstance.interceptors.request.use(
    (config) => {
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