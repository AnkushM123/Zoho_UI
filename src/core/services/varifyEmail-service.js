import axios from 'axios';
import path from '../../config/path';

const varifyEmail = async (inputData) => {
    return axios.post(path.varifyEmail, inputData);
};

export default varifyEmail;