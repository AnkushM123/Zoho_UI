import axios from 'axios';
import path from '../../config/path';

const getLeaveTypeById = (id, jwtToken) => {
    return axios.get(path.getLeaveTypeById + `/${id}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
};

export default getLeaveTypeById;