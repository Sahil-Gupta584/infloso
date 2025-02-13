import Cookies from 'js-cookie';

export const setAuthCookie = (token: string, rememberMe: boolean) => {
  const expires = rememberMe ? 30 : 1;
  Cookies.set('auth_token', token, { expires });
};

export const getAuthCookie = () => {
  return Cookies.get('auth_token');
};

export const removeAuthCookie = () => {
  Cookies.remove('auth_token');
};