interface User {
  id: string;
  email: string;
  name: string;
}

const MOCK_USER: User = {
  id: "1",
  email: "admin@indocoffe.com",
  name: "Admin User",
};

const MOCK_CREDENTIALS = {
  email: "admin@indocoffe.com",
  password: "password123",
};

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(email: string, password: string): boolean {
    if (
      email === MOCK_CREDENTIALS.email &&
      password === MOCK_CREDENTIALS.password
    ) {
      this.currentUser = MOCK_USER;
      localStorage.setItem("currentUser", JSON.stringify(MOCK_USER));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();
export type { User };
