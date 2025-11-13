import api from './http';

export const upgradeToOwner = async () => {
  const { data } = await api.post('/users/me/upgrade-owner');
  if (data?.token) localStorage.setItem('token', data.token);
  return data;
};
