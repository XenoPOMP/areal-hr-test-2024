import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getSessionUserId = async (): Promise<number | null> => {
  try {
    const { data: session } = await axios.get(`${API_URL}auth/session`, {
      withCredentials: true,
    });

    if (session.user && session.user.id) {
      return session.user.id;
    } else {
      throw new Error('Недействительная сессия');
    }
  } catch (error) {
    console.error('Ошибка при получении сессии:', error);
    return null;
  }
};
