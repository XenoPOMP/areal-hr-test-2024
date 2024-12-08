import axiosInstance from './axiosInstance';

export const getEmployees = async () => {
  const response = await axiosInstance.get('/employees');
  return response.data;
};

export const createEmployee = async (employeeData: {
  name: string;
  departmentId: number;
  positionId: number;
}) => {
  const response = await axiosInstance.post('/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (
  id: string,
  employeeData: { name: string; departmentId: number; positionId: number }
) => {
  const response = await axiosInstance.put(`/employees/${id}`, employeeData);
  return response.data;
};
