import axios from 'axios';
import path from '../../config/path';

const login = async (inputData) => {
    return axios.post(path.loginUi.login, inputData);
};

export default login;