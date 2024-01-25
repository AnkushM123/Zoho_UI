import axios from 'axios';
import urlPath from '../../config/path';

const login = async (inputData) => {
    return axios.post(urlPath.login, inputData);
};

export default login;