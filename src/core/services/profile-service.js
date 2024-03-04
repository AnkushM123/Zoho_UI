import path from '../../config/path';
import axiosInstance from './axiosInterceptor-service';

const loggedInUser = async () => {
    return axiosInstance.get(path.profile)
}

const getManagerDetail = async (id) => {
    return axiosInstance.get(path.getUserById + `/${id}`)
}

export default { loggedInUser, getManagerDetail };