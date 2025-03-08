import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const validateName = (name: string): boolean => {
  return name.length >= 2;
};

class AuthService {
  private readonly USER_KEY = 'gsynergy_user';
  private readonly TOKEN_KEY = 'gsynergy_token';

  // Simulated user database
  private readonly DEMO_USER: AuthResponse = {
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@gsynergy.com',
    },
    token: 'demo-token-123',
  };

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo purposes, accept any email/password
    if (credentials.email && credentials.password) {
      localStorage.setItem(this.TOKEN_KEY, this.DEMO_USER.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(this.DEMO_USER.user));
      return this.DEMO_USER;
    }

    throw new Error('Invalid credentials');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo purposes, create a new user with the provided data
    const newUser: AuthResponse = {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
      },
      token: Math.random().toString(36).substr(2, 16),
    };

    localStorage.setItem(this.TOKEN_KEY, newUser.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser.user));
    return newUser;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getCurrentUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
