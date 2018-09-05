import axiosLib from 'axios';

export const axios = axiosLib.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api/'
      : 'http://localhost:6768/api/',
  withCredentials: process.env.NODE_ENV === 'production'
});
