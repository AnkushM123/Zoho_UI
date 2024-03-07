import axios from 'axios';
import path from '../../config/path';

const loggedInUser = async (jwtToken) => {
    return axios.get(path.profile, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

const getManagerDetail = async (id,jwtToken) => {
    return axios.get(path.getManagerDetail+`/${id}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

export default {loggedInUser,getManagerDetail};