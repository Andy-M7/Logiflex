// src/services/usersApi.ts
import axios from 'axios';
import { API_URL } from './api';

// Función reutilizable para formatear errores
const catchError = (err: any, defaultMsg: string) => {
  const msg =
    err?.response?.data?.message ||
    err?.message ||
    defaultMsg;

  throw new Error(msg);
};

export const UsersApi = {

  // ============================================
  // ⭐ Obtener lista de usuarios
  // ============================================
  getAll: async () => {
    try {
      return await axios.get(`${API_URL}/users`);
    } catch (err) {
      catchError(err, "No se pudo cargar la lista de usuarios");
    }
  },

  // ============================================
  // ⭐ Crear usuario
  // ============================================
  create: async (payload: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) => {
    try {
      return await axios.post(`${API_URL}/users`, payload);
    } catch (err) {
      catchError(err, "Error al crear usuario");
    }
  },

  // ============================================
  // ⭐ Actualizar usuario
  // ============================================
  update: async (id: string, payload: any) => {
    try {
      return await axios.patch(`${API_URL}/users/${id}`, payload);
    } catch (err) {
      catchError(err, "Error al actualizar usuario");
    }
  },

  // ============================================
  // ⭐ Eliminar usuario
  // ============================================
  delete: async (id: string) => {
    try {
      return await axios.delete(`${API_URL}/users/${id}`);
    } catch (err) {
      catchError(err, "No se pudo eliminar el usuario");
    }
  },

  // ============================================
  // ⭐ Activar usuario
  // ============================================
  activate: async (id: string) => {
    try {
      return await axios.patch(`${API_URL}/users/${id}/activate`);
    } catch (err) {
      catchError(err, "No se pudo activar el usuario");
    }
  },

  // ============================================
  // ⭐ Desactivar usuario
  // ============================================
  deactivate: async (id: string) => {
    try {
      return await axios.patch(`${API_URL}/users/${id}/deactivate`);
    } catch (err) {
      catchError(err, "No se pudo desactivar el usuario");
    }
  },

};
