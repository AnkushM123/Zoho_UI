import axios from 'axios';
import path from '../../config/path';
import setupAxiosInterceptors from './axiosInterceptor-service';

const login = async (inputData) => {
    return axios.post(path.login, inputData);
};

const setPassword = async (inputData, id) => {
    return axios.put(path.setPassword + `/${id}`, inputData)
};

const varifyEmail = async (inputData) => {
    return axios.post(path.varifyEmail, inputData);
};

const register = async (formData) => {
    setupAxiosInterceptors();
    return axios.post(path.register, formData, {
        headers: {
            'content-type': 'multipart/form-data',
        },
    })
}

const createLeaveRecord = async (inputData, jwtToken) => {
    setupAxiosInterceptors();
    return axios.post(path.createLeaveRecord, inputData)
}

const getByRole = async (id) => {
    setupAxiosInterceptors();
    return axios.get(path.getByRole + `/${id}`)
}

export default { login, setPassword, varifyEmail, register, createLeaveRecord, getByRole };