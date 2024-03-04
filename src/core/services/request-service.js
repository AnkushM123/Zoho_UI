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

export default { getRequestByManagerId, getUser };