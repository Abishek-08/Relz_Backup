import axios from 'axios';

// const axiosPublic = axios.create({
//   baseURL: 'https://racz360.relevantz.com:5001/racz/',
//   withCredentials: true
// });

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true
});
// const axiosPublic = axios.create({
//   baseURL: 'https://racz360.relevantz.com:5001/racz/',
//   withCredentials: true
// });

export default axiosPublic;

