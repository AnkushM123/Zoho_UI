import axios from 'axios';
import path from '../../config/path';

const login = async (inputData) => {
    return axios.post(path.login, inputData);
};

const setPassword = async (inputData, id) => {
    return axios.put(path.setPassword + `/${id}`, inputData)
};

const varifyEmail = async (inputData) => {
    return axios.post(path.varifyEmail, inputData);
};

const register = async (formData, jwtToken) => {
    return axios.post(path.register, formData, {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': `Bearer ${jwtToken}`,
        },
    })
}

const createLeaveRecord = async (inputData, jwtToken) => {
    return axios.post(path.createLeaveRecord, inputData, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
        },
    })
}

export default { login, setPassword, varifyEmail, register, createLeaveRecord };