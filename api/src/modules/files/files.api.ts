import axios from 'axios';

const API_URL = 'http://localhost:3000/files';

export const getFiles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createFile = async (fileData: { name: string; link?: string }) => {
  const response = await axios.post(API_URL, fileData);
  return response.data;
};

export const updateFile = async (
  id: number,
  fileData: { name: string; link?: string },
) => {
  const response = await axios.put(`${API_URL}/${id}`, fileData);
  return response.data;
};
