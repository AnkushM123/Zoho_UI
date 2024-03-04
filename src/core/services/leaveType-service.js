import path from '../../config/path';
import axiosInstance from './axiosInterceptor-service';

const getLeaveTypeById = (id) => {
    return axiosInstance.get(path.getLeaveTypeById + `/${id}`)
};

export default getLeaveTypeById;