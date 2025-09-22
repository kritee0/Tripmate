import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: false, 
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn(" Unauthorized - maybe token expired");
   
    }
    return Promise.reject(error);
  }
);

export default api;
