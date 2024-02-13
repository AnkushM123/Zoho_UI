import axios from 'axios';
import path from '../../config/path';
import setupAxiosInterceptors from './axiosInterceptor-service';

const varifyEmail = async (inputData) => {
    return axios.post(path.varifyEmail, inputData);
};

const updateUser = async (id, formData) => {
    setupAxiosInterceptors();
    return axios.put(path.update + `/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export default { varifyEmail, updateUser };