import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
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
  private token: string | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    if (!validateEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    if (!validatePassword(credentials.password)) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Mock API call - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token',
          user: {
            id: '1',
            name: credentials.email.split('@')[0],
            email: credentials.email
          }
        });
      }, 500);
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (!data.email || !data.password || !data.name) {
      throw new Error('All fields are required');
    }
    if (!validateName(data.name)) {
      throw new Error('Name must be at least 2 characters long');
    }
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    if (!validatePassword(data.password)) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Mock API call - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token',
          user: {
            id: '1',
            name: data.name,
            email: data.email
          }
        });
      }, 500);
    });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }
}

export const authService = new AuthService();
