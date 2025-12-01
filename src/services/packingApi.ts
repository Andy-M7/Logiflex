import axios from 'axios';
import { API_URL } from './api';

export const PackingApi = {

  // Obtener detalle en base al ID del packing
  getDetalle: (packingId: string) =>
    axios.get(`${API_URL}/packing/${packingId}`),

  // Guardar reporte de producto
  saveDetalle: (packingId: string, payload: any) =>
    axios.post(`${API_URL}/packing/${packingId}/detalle`, payload),

  // Finalizar packing
  cerrarPacking: (packingId: string, payload: any) =>
    axios.post(`${API_URL}/packing/${packingId}/cerrar`, payload),
};
