import axios from 'axios';
import path from '../../config/path';
import setupAxiosInterceptors from './axiosInterceptor-service';

const changePassword = async (inputData, id) => {
    setupAxiosInterceptors();
    return axios.post(path.changePassword + `/${id}`, inputData)
};

export default changePassword;