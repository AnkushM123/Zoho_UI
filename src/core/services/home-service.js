import axios from 'axios';
import path from '../../config/path';
import axiosInstance from './axiosInterceptor-service';

const getEmployees = async () => {
  return axiosInstance.get(path.home)
};

export default getEmployees;