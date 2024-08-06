import axios from "axios";
const api = axios.create();

// TODO: customize server
export const SERVER_HOST = `http://localhost:8080/steam`;
export const NORMAL_SERVER_HOST = `http://localhost:8080`;
export default api;