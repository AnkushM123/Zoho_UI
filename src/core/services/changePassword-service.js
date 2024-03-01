import axios from 'axios';
import path from '../../config/path';
import axiosInstance from './axiosInterceptor-service';

const changePassword = async (inputData, id) => {
    return axiosInstance.post(path.changePassword + `/${id}`, inputData)
};

export default changePassword;