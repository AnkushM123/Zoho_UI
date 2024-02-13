import axios from 'axios';
import path from '../../config/path';
import setupAxiosInterceptors from './axiosInterceptor-service';

const getLeaveRecords = async (inputData) => {
    setupAxiosInterceptors();
    return axios.post(path.getLeaveRecord, inputData)
};

const getParticularRecord = async (inputData) => {
    setupAxiosInterceptors();
    return axios.post(path.particularLeaveRecord, inputData)
};

const loggedInUser = async () => {
    setupAxiosInterceptors();
    return axios.get(path.profile)
}

const updateLeaveRecord = async (leaveId, leaveRecord) => {
    setupAxiosInterceptors();
    return axios.put(path.updateLeaveRecord + `/${leaveId}`, leaveRecord)
}

const applyLeaveRequest = async (formData) => {
    setupAxiosInterceptors();
    return axios.post(path.applyLeaveRequest, formData, {
        headers: {
            'content-type': 'multipart/form-data'
        },
    })
}

export default { getLeaveRecords, getParticularRecord, loggedInUser, updateLeaveRecord, applyLeaveRequest };