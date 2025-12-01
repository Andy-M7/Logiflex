import axios from "axios";

export const backendApi = axios.create({
    baseURL: 'http://10.0.2.2:3000/api/v1'
});