import axios from 'axios';
import path from '../../config/path';

const getNotification = async (userId, jwtToken) => {
    return axios.get(path.getNotification + `/${userId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

const createNotification = async (notification, jwtToken) => {
    return axios.post(path.createNotification, notification, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'content-type': 'multipart/form-data'
        }
    })
}

const updateNotification = async (notificationId, notification, jwtToken) => {
    return axios.put(path.updateNotification + `/${notificationId}`, notification, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

const updateAllNotification = async (userId, notification, jwtToken) => {
    return axios.put(path.updateAllNotification + `/${userId}`, notification, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

export default { getNotification, createNotification, updateNotification, updateAllNotification };
