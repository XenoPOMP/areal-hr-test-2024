import axiosInstance from './axiosInstance';

export const getPositions = async () => {
  const response = await axiosInstance.get('/positions');
  return response.data;
};

export const createPosition = async (data: { name: string }) => {
  const response = await axiosInstance.post('/positions', data);
  return response.data;
};

export const updatePosition = async (id: string, data: { name: string }) => {
  const response = await axiosInstance.put(`/positions/${id}`, data);
  return response.data;
};
