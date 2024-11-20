import axios from 'axios';
import { UnwrapRef } from 'vue';

const API_URL = 'http://localhost:3000/api';

// Функции для работы с организациями
export const getOrganizations = async () => {
  const response = await axios.get(`${API_URL}/organizations`);
  return response.data;
};

export const createOrganization = async (data: {
  name: string;
  comment: string;
}) => {
  const response = await axios.post(`${API_URL}/organizations`, data);
  return response.data;
};

export const updateOrganization = async (
  id: string,
  data: { name: string; comment: string }
) => {
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

export const createDepartment = async (data: {
  name: string;
  comment: string;
}) => {
  const response = await axios.post(`${API_URL}/departments`, data);
  return response.data;
};

export const updateDepartment = async (
  id: string,
  data: { name: string; comment: string }
) => {
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

export const createPosition = async (data: { name: string }) => {
  const response = await axios.post(`${API_URL}/positions`, data);
  return response.data;
};

export const updatePosition = async (id: string, data: { name: string }) => {
  const response = await axios.put(`${API_URL}/positions/${id}`, data);
  return response.data;
};

export const deletePosition = async (id: string) => {
  const response = await axios.delete(`${API_URL}/positions/${id}`);
  return response.data;
};

// Функции для работы с сотрудниками
export const getEmployees = async () => {
  const response = await axios.get(`${API_URL}/employees`);
  return response.data;
};

export const createEmployee = async (data: {
  name: string;
  surname: string;
  second_name?: string;
  date_birth: string;
  position_id: number | null;
}) => {
  const response = await axios.post(`${API_URL}/employees`, data);
  return response.data;
};

import { Employee } from 'src/types/Employee';
export const updateEmployee = async (id: string, data: Employee) => {
  const response = await axios.put(`${API_URL}/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const response = await axios.delete(`${API_URL}/employees/${id}`);
  return response.data;
};

// Функции для работы с файлами
export const getFiles = async () => {
  const response = await axios.get(`${API_URL}/files`);
  return response.data;
};

export const createFile = async (data: { name: string; link: string }) => {
  const response = await axios.post(`${API_URL}/files`, data);
  return response.data;
};

export const updateFile = async (
  id: string,
  data: { name: string; link: string }
) => {
  const response = await axios.put(`${API_URL}/files/${id}`, data);
  return response.data;
};

export const deleteFile = async (id: string) => {
  const response = await axios.delete(`${API_URL}/files/${id}`);
  return response.data;
};

// Функции для работы с кадровыми операциями
export const getHrActions = async () => {
  const response = await axios.get(`${API_URL}/hr_actions`);
  return response.data;
};

export const createHrAction = async (data: {
  action_type: string;
  date: string;
  salary: number;
  employee_id: number | null;
  department_id: number | null;
  position_id: number | null;
}) => {
  const response = await axios.post(`${API_URL}/hr_actions`, data);
  return response.data;
};

export const updateHrAction = async (
  id: string,
  data: {
    action_type: string;
    date: string;
    salary: number;
    employee_id: number | null;
    department_id: number | null;
    position_id: number | null;
  }
) => {
  const response = await axios.put(`${API_URL}/hr_actions/${id}`, data);
  return response.data;
};

export const deleteHrAction = async (id: string) => {
  const response = await axios.delete(`${API_URL}/hr_actions/${id}`);
  return response.data;
};

// Функции для работы с историей изменений
export const getHistoryOfChanges = async () => {
  const response = await axios.get(`${API_URL}/history_of_changes`);
  return response.data;
};

export const createHistoryOfChange = async (data: {
  object: string;
  field: object;
  date: string;
}) => {
  const response = await axios.post(`${API_URL}/history_of_changes`, data);
  return response.data;
};

export const updateHistoryOfChange = async (
  id: string,
  data: {
    object: string;
    field: object;
    date: string;
  }
) => {
  const response = await axios.put(`${API_URL}/history_of_changes/${id}`, data);
  return response.data;
};

export const deleteHistoryOfChange = async (id: string) => {
  const response = await axios.delete(`${API_URL}/history_of_changes/${id}`);
  return response.data;
};
