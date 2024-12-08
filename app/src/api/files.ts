import axiosInstance from './axiosInstance';

export const getFiles = async () => {
  const response = await axiosInstance.get('/files');
  return response.data;
};

export const createFile = async (data: {
  name: string;
  link: string;
  employee_id?: number | null;
}) => {
  const response = await axiosInstance.post('/files', data);
  return response.data;
};

export const updateFile = async (
  id: string,
  data: { name: string; link: string; employee_id: number }
) => {
  const response = await axiosInstance.put(`/files/${id}`, data);
  return response.data;
};
