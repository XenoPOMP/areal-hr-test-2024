import axios from 'axios';

const API_URL = 'http://localhost:3000/hr_action';

// Получение всех записей кадровых действий
export const getHrActions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Создание новой записи кадрового действия
export const createHrAction = async (actionData: {
  action_type: string;
  date?: Date;
}) => {
  const response = await axios.post(API_URL, actionData);
  return response.data;
};

// Обновление записи кадрового действия по ID
export const updateHrAction = async (
  id: number,
  actionData: { action_type?: string; date?: Date },
) => {
  const response = await axios.put(`${API_URL}/${id}`, actionData);
  return response.data;
};

// Удаление записи кадрового действия по ID
export const deleteHrAction = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
