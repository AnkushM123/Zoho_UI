import axios from 'axios';
const axiosInstance=axios.create();

let axiosInterceptorsSetup = false;

  const token =localStorage.getItem('authToken');
    if (!axiosInterceptorsSetup) {
        axiosInstance.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                console.log(config)
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
            
        );
        axiosInterceptorsSetup=true
    }

export default axiosInstance;