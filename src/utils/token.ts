export const getToken = () => {
  let token = '';
  const cookie = document.cookie.split('; ').find(row => row.startsWith('token'));
  token = cookie ? cookie.split('=')[1] : '';

  return token;
};

export const saveToken = (token: string) => {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('token'));

  if (cookie) {
    deleteCookie();
  }

  document.cookie =
    process.env.NODE_ENV === 'development' ? `token=${token};path=/;` : `token=${token};path=/; SameSite=None; Secure;`;
};

export const isWebview = () => {
  const { userAgent } = navigator;
  const isMobile = /Mobi|Android/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);

  return isMobile || isTablet;
};

export const deleteCookie = () => {
  const pastDate = new Date();
  const cookieName = getToken();
  pastDate.setFullYear(pastDate.getFullYear() - 1);

  document.cookie = `${cookieName}=; expires=${pastDate.toUTCString()}; path=/`;
};
