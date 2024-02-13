import axios from 'axios';
import path from '../../config/path';
import setupAxiosInterceptors from './axiosInterceptor-service';

const getRequestByManagerId = async (managerId) => {
    setupAxiosInterceptors();
    return axios.get(path.getRequestByManagerId + `/${managerId}`)
}

const getUser = async (id) => {
    setupAxiosInterceptors();
    return axios.get(path.getUserById + `/${id}`)
}

const getByRequestId = async (requestId) => {
    setupAxiosInterceptors();
    return axios.get(path.getRequestByRequestId + `/${requestId}`)
}

const changeRequestStatus = async (requestId, status) => {
    setupAxiosInterceptors();
    return axios.put(path.changeRequestStatus + `/${requestId}`, status)
}

const getByUserId = async (userId) => {
    setupAxiosInterceptors();
    return axios.get(path.getRequestByUserId + `/${userId}`)
}

const addCommentInRequest = async (requestId, comment) => {
    setupAxiosInterceptors();
    return axios.put(path.addCommentInRequest + `/${requestId}`, comment)
}

const getRequestByStatus = async (userId) => {
    setupAxiosInterceptors();
    return axios.get(path.getRequestByStatus + `/${userId}`)
}

const getCompensantoryRequest = async (managerId) => {
    setupAxiosInterceptors();
    return axios.get(path.getCompensantoryRequest + `/${managerId}`)
}

const getByManagerIdAndStatus = async (requestId, status) => {
    setupAxiosInterceptors();
    return axios.post(path.getRequestByManagerIdAndStatus + `/${requestId}`, status)
}

export default { getRequestByManagerId, getUser, getByRequestId, changeRequestStatus, getByUserId, addCommentInRequest, getRequestByStatus, getCompensantoryRequest, getByManagerIdAndStatus };