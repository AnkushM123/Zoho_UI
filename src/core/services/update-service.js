import axios from 'axios';
import path from '../../config/path';

const updateUser = async (id, formData) => {
    return axios.put(path.update + `/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export default { updateUser };