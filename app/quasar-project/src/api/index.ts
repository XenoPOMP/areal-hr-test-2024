import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Функции для работы с организациями
export const getOrganizations = async () => {
  const response = await axios.get(`${API_URL}/organizations`);
  return response.data;
};

export const createOrganization = async (data: { name: string; comment: string }) => {
  const response = await axios.post(`${API_URL}/organizations`, data);
  return response.data;
};

export const updateOrganization = async (id: string, data: { name: string; comment: string }) => {
  const response = await axios.put(`${API_URL}/organizations/${id}`, data);
  return response.data;
};

export const deleteOrganization = async (id: string) => {
  const response = await axios.delete(`${API_URL}/organizations/${id}`);
  return response.data;
};

// Функции для работы с департаментами
export const getDepartments = async () => {
  const response = await axios.get(`${API_URL}/departments`);
  return response.data;
};

export const createDepartment = async (data: { name: string; comment: string }) => {
  const response = await axios.post(`${API_URL}/departments`, data);
  return response.data;
};

export const updateDepartment = async (id: string, data: { name: string; comment: string }) => {
  const response = await axios.put(`${API_URL}/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id: string) => {
  const response = await axios.delete(`${API_URL}/departments/${id}`);
  return response.data;
};

// Функции для работы с должностями
export const getPositions = async () => {
  const response = await axios.get(`${API_URL}/positions`);
  return response.data;
};

export const createPosition = async (data: { name: string; }) => {
  const response = await axios.post(`${API_URL}/positions`, data);
  return response.data;
};

export const updatePosition = async (id: string, data: { name: string; }) => {
  const response = await axios.put(`${API_URL}/positions/${id}`, data);
  return response.data;
};

export const deletePosition = async (id: string) => {
  const response = await axios.delete(`${API_URL}/positions/${id}`);
  return response.data;
};
