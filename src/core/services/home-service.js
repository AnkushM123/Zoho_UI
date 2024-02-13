import axios from 'axios';
import path from '../../config/path';
import setupAxiosInterceptors from './axiosInterceptor-service';

const getEmployees = async () => {
  setupAxiosInterceptors();
  return axios.get(path.home)
};

export default getEmployees;