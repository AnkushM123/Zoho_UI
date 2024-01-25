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

export default { login, setPassword, varifyEmail };