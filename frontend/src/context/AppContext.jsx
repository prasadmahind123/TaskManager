// src/api.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/"; // Your Django backend

// Get JWT from localStorage
const getToken = () => localStorage.getItem("access_token");

// Axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
