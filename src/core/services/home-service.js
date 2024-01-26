import axios from 'axios';
import path from '../../config/path';

const getEmployees = async (jwtToken) => {
    return axios.get(path.home, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      })
};

export default getEmployees;