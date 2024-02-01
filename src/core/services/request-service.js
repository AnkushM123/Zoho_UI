import axios from 'axios';
import path from '../../config/path';

const getRequestByManagerId = async (managerId, jwtToken) => {
    return axios.get(path.getRequestByManagerId + `/${managerId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

const getUser = async (id, jwtToken) => {
    return axios.get(path.getUserById + `/${id}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

const getByRequestId = async (requestId, jwtToken) => {
    return axios.get(path.getRequestByRequestId + `/${requestId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

const changeRequestStatus = async (requestId, status, jwtToken) => {
    return axios.put(path.changeRequestStatus + `/${requestId}`, status, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

const getByUserId = async (userId, jwtToken) => {
    return axios.get(path.getRequestByUserId + `/${userId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

const addCommentInRequest = async (requestId, comment, jwtToken) => {
    return axios.put(path.addCommentInRequest + `/${requestId}`, comment, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

export default { getRequestByManagerId, getUser, getByRequestId, changeRequestStatus, getByUserId, addCommentInRequest };