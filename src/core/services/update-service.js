import path from '../../config/path';
import axiosInstance from './axiosInterceptor-service';

const updateUser = async (id, formData) => {
    return axiosInstance.put(path.update + `/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
}

export default { updateUser };