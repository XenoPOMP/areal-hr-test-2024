import axios from 'axios';

const API_URL = 'http://localhost:3000/employees';

export const getEmployees = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createEmployee = async (empData: {
  name: string;
  surname?: string;
  second_name?: string;
  date_birth: Date;
}) => {
  const response = await axios.post(API_URL, empData);
  return response.data;
};

export const updateEmployee = async (
  id: number,
  empData: {
    name: string;
    surname?: string;
    second_name?: string;
    date_birth?: Date;
  },
) => {
  const response = await axios.put(
    `http://localhost:3000/employees/${id}`,
    empData,
  );
  return response.data;
};

export const deleteEmployee = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
