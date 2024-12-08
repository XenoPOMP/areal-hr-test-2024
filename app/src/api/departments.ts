import axiosInstance from './axiosInstance';

export const getDepartments = async () => {
  const response = await axiosInstance.get('/departments');
  return response.data;
};

export const createDepartment = async (data: {
  name: string;
  comment: string;
}) => {
  const response = await axiosInstance.post('/departments', data);
  return response.data;
};

export const updateDepartment = async (
  id: string,
  data: { name: string; comment: string }
) => {
  const response = await axiosInstance.put(`/departments/${id}`, data);
  return response.data;
};
