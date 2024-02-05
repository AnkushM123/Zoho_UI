import axios from 'axios';
import path from '../../config/path';

const changePassword = async (inputData, id, jwtToken) => {
    return axios.post(path.changePassword + `/${id}`, inputData, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
        },
    })
};

export default changePassword;