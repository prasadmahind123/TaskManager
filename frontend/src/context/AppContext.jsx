// src/api.js
import axios from "axios";


const API_URL = "http://127.0.0.1:8000/api/"; // Your Django backend
let isRefreshing = false;

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;
  try {
    const res = await axios.post(`${API_URL}auth/token/refresh/`, { refresh });
    localStorage.setItem("access_token", res.data.access);
    return res.data.access;
  } catch (err) {
    console.error("Refresh failed", err);
    return null;
  }
};

// Get JWT from localStorage
const getToken = () => localStorage.getItem("access_token");

// Axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccess = await refreshToken();
      if (newAccess) {
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axios(originalRequest); // retry the request
      }
    }
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const loginUser = async (username, password) => {
  const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", { username, password });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await axios.post("http://127.0.0.1:8000/api/auth/register/", { username, email, password });
  return response.data;
};

// Task APIs
export const getTasks = async () => {
  const response = await axiosInstance.get("http://127.0.0.1:8000/api/tasks/");
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axiosInstance.post("http://127.0.0.1:8000/api/tasks/", taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await axiosInstance.put(`http://127.0.0.1:8000/api/tasks/${taskId}/`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axiosInstance.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
  return response.data;
};
