import axios from 'axios';
import path from '../../config/path';
import axiosInstance from './axiosInterceptor-service';

const getLeaveRecords = async (inputData) => {
    return axiosInstance.post(path.getLeaveRecord, inputData)
};

const getParticularRecord = async (inputData) => {
    return axiosInstance.post(path.particularLeaveRecord, inputData)
};

const loggedInUser = async () => {
    return axiosInstance.get(path.profile)
}

const updateLeaveRecord = async (leaveId, leaveRecord) => {
    return axiosInstance.put(path.updateLeaveRecord + `/${leaveId}`, leaveRecord)
}

const applyLeaveRequest = async (formData) => {
    return axiosInstance.post(path.applyLeaveRequest, formData, {
        headers: {
            'content-type': 'multipart/form-data'
        },
    })
}

export default { getLeaveRecords, getParticularRecord, loggedInUser, updateLeaveRecord, applyLeaveRequest };