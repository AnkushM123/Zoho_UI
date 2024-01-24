import axios from 'axios';

const login = async (inputData) => {
  try {
    const result = await axios.post("http://localhost:3000/auth/login", inputData);
    return result;
  } catch (error) {
    throw error;
  }
};

export default login;