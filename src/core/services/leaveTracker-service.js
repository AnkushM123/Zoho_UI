import axios from 'axios';
import path from '../../config/path';

const getLeaveRecords = async (inputData, jwtToken) => {
    return axios.post(path.getLeaveRecord, inputData, {
        headers: {
          'Authorization' : `Bearer ${jwtToken}` 
        }
      })
};

const getParticularRecord = async (inputData, jwtToken) => {
    return axios.post(path.particularLeaveRecord, inputData, {
        headers: {
          'Authorization' : `Bearer ${jwtToken}` 
        }
      })
};

const loggedInUser = async (jwtToken) => {
    return axios.get(path.profile, {
        headers: {
          'Authorization' : `Bearer ${jwtToken}` 
        }
      })
}

const updateLeaveRecord = async (leaveId, leaveRecord, jwtToken) => {
    return axios.put(path.updateLeaveRecord + `/${leaveId}`, leaveRecord, {
        headers: {
          'Authorization' : `Bearer ${jwtToken}` 
        }
      })
}

const applyLeaveRequest = async (formData, jwtToken) => {
    return axios.post(path.applyLeaveRequest, formData, {
        headers: {
            'Authorization' : `Bearer ${jwtToken}` ,
            'content-type': 'multipart/form-data'
        },
    })
}

export default { getLeaveRecords, getParticularRecord, loggedInUser, updateLeaveRecord, applyLeaveRequest };