import axiosInstance from './axiosInstance';

export const getHrActions = async () => {
  const response = await axiosInstance.get('/hr_actions');
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
  const response = await axiosInstance.post('/hr_actions', data);
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
  const response = await axiosInstance.put(`/hr_actions/${id}`, data);
  return response.data;
};
