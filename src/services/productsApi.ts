import axios from "axios";
import { API_URL } from "./api";

export const ProductsApi = {

  // 🔹 Obtener todos los productos (con filtro opcional)
  getAll: (params?: any) =>
    axios.get(`${API_URL}/products`, { params }),

  // 🔹 Crear un producto
  create: (payload: any) =>
    axios.post(`${API_URL}/products`, payload),

  // 🔹 Actualizar un producto
  update: (id: string, payload: any) =>
    axios.patch(`${API_URL}/products/${id}`, payload),

  // 🔹 Eliminar un producto
  delete: (id: string) =>
    axios.delete(`${API_URL}/products/${id}`),

  // 🔹 Activar / Desactivar producto (opcional)
  toggle: (id: string) =>
    axios.patch(`${API_URL}/products/${id}/toggle`),
};
