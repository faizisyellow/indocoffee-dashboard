import { type AxiosInstance } from "axios";
import { client } from "./axios/axios";
import type { LoginRequest } from "./request/login";
import type { Login } from "../store";
import type { LoginResponse } from "./response/login";

class AuthService {
  axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async login(cred: LoginRequest): Promise<Login> {
    const response = await this.axios.post<LoginResponse>(
      "authentication/sign-in",
      cred,
    );
    return response.data.data;
  }

  logout(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() >= payload.exp * 1000;
      if (isExpired) {
        localStorage.removeItem("token");
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem("token");
      return false;
    }
  }
}

export const authService = new AuthService(client);
