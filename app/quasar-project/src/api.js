import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // Убедитесь, что адрес вашего сервера указан правильно
});

// Функции для работы с Organizations
export const getOrganizations = async () => {
  const response = await api.get('/organizations');
  return response.data;
};

export const createOrganization = async (data) => {
  const response = await api.post('/organizations', data);
  return response.data;
};

export const updateOrganization = async (id, data) => {
  const response = await api.put(`/organizations/${id}`, data);
  return response.data;
};

export const deleteOrganization = async (id) => {
  const response = await api.delete(`/organizations/${id}`);
  return response.data;
};

// Функции для работы с Departments
export const getDepartments = async () => {
  const response = await api.get('/departments');
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await api.post('/departments', data);
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await api.put(`/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};

// Функции для работы с Positions
export const getPositions = async () => {
  const response = await api.get('/positions');
  return response.data;
};

export const createPosition = async (data) => {
  const response = await api.post('/positions', data);
  return response.data;
};

export const updatePosition = async (id, data) => {
  const response = await api.put(`/positions/${id}`, data);
  return response.data;
};

export const deletePosition = async (id) => {
  const response = await api.delete(`/positions/${id}`);
  return response.data;
};
