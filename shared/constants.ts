export const AUTH_COOKIE_NAME = import.meta.env.PROD
  ? "__Secure-auth"
  : "auth-cookie";
export const APP_URL = import.meta.env.VITE_PUBLIC_APP_URL;
