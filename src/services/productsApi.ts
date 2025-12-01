import axios from 'axios';
import { API_URL } from './api';

export const ProductsApi = {
  getAll: () => axios.get(`${API_URL}/products`),

  create: (payload: any) =>
    axios.post(`${API_URL}/products`, payload),

  update: (id: string, payload: any) =>
    axios.patch(`${API_URL}/products/${id}`, payload),

  delete: (id: string) =>
    axios.delete(`${API_URL}/products/${id}`),
};
