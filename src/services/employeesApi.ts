import axios from "axios";
import { API_URL } from "./api";

export const EmployeesApi = {

  getAll: (params?: any) =>
    axios.get(`${API_URL}/employees`, { params }),

  create: (payload: any) =>
    axios.post(`${API_URL}/employees`, payload),

  update: (id: string, payload: any) =>
    axios.patch(`${API_URL}/employees/${id}`, payload),

  delete: (id: string) =>
    axios.delete(`${API_URL}/employees/${id}`),
};
