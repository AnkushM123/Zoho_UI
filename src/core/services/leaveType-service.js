import axios from 'axios';
import path from '../../config/path';
import setupAxiosInterceptors from './axiosInterceptor-service';

const getLeaveTypeById = (id) => {
    setupAxiosInterceptors();
    return axios.get(path.getLeaveTypeById + `/${id}`)
};

export default getLeaveTypeById;