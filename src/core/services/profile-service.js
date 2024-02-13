import axios from 'axios';
import path from '../../config/path';
import setupAxiosInterceptors from './axiosInterceptor-service';

const loggedInUser = async () => {
    setupAxiosInterceptors();
    return axios.get(path.profile)
}

const getManagerDetail = async (id) => {
    setupAxiosInterceptors();
    return axios.get(path.getUserById + `/${id}`)
}

export default { loggedInUser, getManagerDetail };