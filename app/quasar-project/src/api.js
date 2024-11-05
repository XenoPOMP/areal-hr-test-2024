import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getOrganizations = async () => {
  const response = await api.get('/organizations');
  return response.data;
};