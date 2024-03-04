import axios from 'axios';
import path from '../../config/path';

const varifyEmail = async (inputData) => {
    return axios.post(path.varifyEmail, inputData);
};

const updateUser = async (id, formData, jwtToken) => {
    return axios.put(path.update + `/${id}`, formData, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data',
        },
    })
}

export default { varifyEmail, updateUser };