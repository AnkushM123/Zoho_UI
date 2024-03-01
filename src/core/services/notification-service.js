import path from '../../config/path';
import axiosInstance from './axiosInterceptor-service';

const getNotification = async (userId) => {
    return axiosInstance.get(path.getNotification + `/${userId}`)
}

const createNotification = async (notification) => {
    return axiosInstance.post(path.createNotification, notification)
}

const updateNotification = async (notificationId, notification) => {
    return axiosInstance.put(path.updateNotification + `/${notificationId}`, notification)
}

const updateAllNotification = async (userId, notification) => {
    return axiosInstance.put(path.updateAllNotification + `/${userId}`, notification)
}

export default { getNotification, createNotification, updateNotification, updateAllNotification };
