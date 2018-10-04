import axiosLib from 'axios';

const basePath = new URL(window.location.href).pathname;

export const axios = axiosLib.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? `${basePath}api/`
      : 'http://localhost:6768/api/',
  withCredentials: process.env.NODE_ENV === 'production'
});

export const getErrorMessage = (e) => {
  let error = e.message;
  if (e.response) {
    if (typeof e.response.data === 'string') {
      error = e.response.data;
    } else if (
      typeof e.response.data === 'object' &&
      e.response.data !== null
    ) {
      error = e.response.data.error;
    }
  }
  return error;
};
