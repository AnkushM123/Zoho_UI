import path from '../../config/path';
import axiosInstance from './axiosInterceptor-service';

const getRequestByManagerId = async (managerId) => {
  return axiosInstance.get(path.getRequestByManagerId + `/${managerId}`)
}

const getUser = async (id) => {
  return axiosInstance.get(path.getUserById + `/${id}`)
}

const getByRequestId = async (requestId) => {
  return axiosInstance.get(path.getRequestByRequestId + `/${requestId}`)
}

const changeRequestStatus = async (requestId, status) => {
  return axiosInstance.put(path.changeRequestStatus + `/${requestId}`, status)
}

const getByUserId = async (userId) => {
  return axiosInstance.get(path.getRequestByUserId + `/${userId}`)
}

const addCommentInRequest = async (requestId, comment) => {
  return axiosInstance.put(path.addCommentInRequest + `/${requestId}`, comment)
}

const getRequestByStatus = async (userId) => {
  return axiosInstance.get(path.getRequestByStatus + `/${userId}`)
}

const getCompensantoryRequest = async (managerId) => {
  return axiosInstance.get(path.getCompensantoryRequest + `/${managerId}`)
}

const getByManagerIdAndStatus = async (requestId, status) => {
  return axiosInstance.post(path.getRequestByManagerIdAndStatus + `/${requestId}`, status)
}

export default { getRequestByManagerId, getUser, getByRequestId, changeRequestStatus, getByUserId, addCommentInRequest, getRequestByStatus, getCompensantoryRequest, getByManagerIdAndStatus };
