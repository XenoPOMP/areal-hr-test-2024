// Общая функция для запросов
export async function fetchAPI(url, options = {}) {
  const response = await fetch(url, { ...options, credentials: 'include' });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      resetAuth();
    }
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}
