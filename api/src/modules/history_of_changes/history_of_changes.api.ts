import axios from 'axios';

const API_URL = 'http://localhost:3000/history-of-changes';

// Получение всех записей истории изменений
export const getHistoryOfChanges = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Удаление записи из истории изменений по ID
export const deleteHistoryOfChange = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
