export const getToken = () => {
  let token = '';
  if (isWebview()) {
    token = localStorage.getItem('token') || '';
  }
  if (!isWebview()) {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('token'));
    token = cookie ? cookie.split('=')[1] : '';
  }

  return token;
};

export const saveToken = (token: string) => {
  if (isWebview()) {
    localStorage.setItem('token', token);
  }

  if (!isWebview()) {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('token'));

    if (cookie) {
      deleteCookie('token');
    }
    document.cookie = `token=${token};path=/`;
  }
};

export const isWebview = () => {
  return window && !window.document.cookie;
};

export const deleteCookie = (cookieName: string) => {
  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - 1);

  document.cookie = `${cookieName}=; expires=${pastDate.toUTCString()}; path=/`;
};
