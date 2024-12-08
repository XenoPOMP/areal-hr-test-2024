import axiosInstance from './axiosInstance';

export const getHistoryOfChanges = async () => {
  const response = await axiosInstance.get('/history-of-changes');
  return response.data;
};
