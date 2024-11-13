import axios from 'axios';

const API_URL = 'http://localhost:3000/history_of_changes';

// Получение всех записей истории изменений
export const getHistoryOfChanges = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Создание новой записи в истории изменений
export const createHistoryOfChange = async (hocData: {
  date: Date;
  login?: string;
  object?: string;
  user_id?: number;
  field?: any;
}) => {
  const response = await axios.post(API_URL, hocData);
  return response.data;
};

// Обновление записи истории изменений по ID
export const updateHistoryOfChange = async (
  id: number,
  hocData: {
    date?: Date;
    login?: string;
    object?: string;
    user_id?: number;
    field?: any;
  },
) => {
  const response = await axios.put(`${API_URL}/${id}`, hocData);
  return response.data;
};

// Удаление записи из истории изменений по ID
export const deleteHistoryOfChange = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
