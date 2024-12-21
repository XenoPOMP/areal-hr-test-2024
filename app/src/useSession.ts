import axiosInstance from 'src/api/axiosInstance';

export const getSessionUserId = async (): Promise<number | null> => {
  try {
    const { data: session } = await axiosInstance.get('auth/session');
    console.log('Session data:', session);
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
