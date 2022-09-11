import axios from "axios";
import { auth } from "./firebase-config";


/**
 * axios instance
 */

axios.defaults.responseType = "json";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

API.interceptors.request.use(
  async (config: any) => {
    const token = await auth.currentUser?.getIdToken(true);

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response: any) => {
    return response?.data;
  },
  (error: any) => {
    return Promise.reject(error.response);
  }
);

export { API };
