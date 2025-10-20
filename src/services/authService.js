import axios from 'axios';

const API_URL = 'http://localhost:8080/admin';

export const loginAdmin = (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password }, {withCredentials: true});
};
