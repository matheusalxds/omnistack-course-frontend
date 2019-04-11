import axios from 'axios';

const api = axios.create({
  baseURL: 'https://omnistack-course-backend.herokuapp.com'
});

export default api;
