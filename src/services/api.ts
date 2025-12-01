// src/services/api.ts (o donde tengas tu axios)
import axios, { AxiosHeaders } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.2.64:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth:firebaseToken');

  // Asegura que headers sea AxiosHeaders
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Accept', 'application/json');

  config.headers = headers;
  return config;
});
