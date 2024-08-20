import axios from "axios";
const api = axios.create();

// TODO: customize server
export const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;
export const NORMAL_SERVER_HOST = process.env.REACT_APP_NORMAL_SERVER_HOST;
export default api;