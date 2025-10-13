import axios, { AxiosError } from "axios";

const clientWithAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

clientWithAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return Promise.reject(new Error("Missing token"));
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

clientWithAuth.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear();

      window.location.href = "/login";

      return Promise.reject(
        new AxiosError("Unauthorized or token expired", "ERR_AUTH_EXPIRED"),
      );
    }

    // just pass the error along
    return Promise.reject(error);
  },
);

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000,
});

export { client, clientWithAuth };
