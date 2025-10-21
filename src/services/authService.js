import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'http://localhost:5000/admin';
=======
const API_URL = 'http://localhost:8080/admin';
>>>>>>> 1aafb9cb5cdebcea246157699756f5ca8cd48537

export const loginAdmin = (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password }, {withCredentials: true});
};
