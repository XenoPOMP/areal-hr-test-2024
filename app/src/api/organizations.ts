import axiosInstance from './axiosInstance';

export const getOrganizations = async () => {
  const response = await axiosInstance.get('/organizations');
  return response.data;
};

export const createOrganization = async (data: {
  name: string;
  comment: string;
}) => {
  const response = await axiosInstance.post('/organizations', data);
  return response.data;
};

export const updateOrganization = async (
  id: string,
  data: { name: string; comment: string }
) => {
  const response = await axiosInstance.put(`/organizations/${id}`, data);
  return response.data;
};
