import axios from 'axios';


const API_URL = 'https://leave-backend-acb9.onrender.com/admin';


export const loginAdmin = (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password }, {withCredentials: true});
};
