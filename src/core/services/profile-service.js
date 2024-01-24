import axios from 'axios';
import path from '../../config/path';

const loggedInUser = async (jwtToken) => {
    return axios.get(path.profileUi.loggedInUser, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
}

export default loggedInUser;