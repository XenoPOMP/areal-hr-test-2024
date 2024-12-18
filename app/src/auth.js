import { setCurrentUser } from './session';
import { fetchAPI } from './api';

// Выполнить вход
export async function login(login, password) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  setCurrentUser(data.user);
  return data;
}

// Выполнить выход
export async function logout() {
  try {
    const data = await fetchAPI('http://localhost:3000/auth/logout', {
      method: 'POST',
    });
    resetAuth();
    console.log('User logged out:', data);
  } catch (error) {
    console.error('Error during logout:', error);
  }
}
