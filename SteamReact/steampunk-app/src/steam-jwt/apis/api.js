import axios from "axios";
const api = axios.create();

// TODO: customize server
export const SERVER_HOST = `http://localhost:8080/steam`;
export default api;