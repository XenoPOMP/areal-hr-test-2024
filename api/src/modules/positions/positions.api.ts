import axios from 'axios';

const API_URL = 'http://localhost:3000/positions';

export const getPositions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createPosition = async (posData: { name: string }) => {
  const response = await axios.post(API_URL, posData);
  return response.data;
};

export const updatePosition = async (id: number, posData: { name: string }) => {
  const response = await axios.put(`${API_URL}/${id}`, posData);
  return response.data;
};

export const deletePosition = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
