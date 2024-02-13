import axios from 'axios';

const setupAxiosInterceptors = () => {
    const jwtToken=localStorage.getItem('authToken')
    axios.interceptors.request.use(
        config => {
            if (jwtToken) {
                config.headers.Authorization = `Bearer ${jwtToken}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;