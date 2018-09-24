import axiosLib from 'axios';

const basePath = new URL(window.location.href).pathname;

export const axios = axiosLib.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? `${basePath}api/`
      : 'http://localhost:6768/api/',
  withCredentials: process.env.NODE_ENV === 'production'
});
