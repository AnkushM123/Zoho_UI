import axios from 'axios';
import path from '../../config/path';

const setPassword = async (inputData, id) => {
    return axios.put(path.setPassword + `/${id}`, inputData)
};

export default setPassword;