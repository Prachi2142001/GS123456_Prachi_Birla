import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulated API call
      // In a real app, this would be a fetch call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response
      return {
        user: {
          id: '1',
          name: 'Test User',
          email: credentials.email,
          role: 'user'
        },
        token: 'mock-jwt-token'
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Simulated API call
      // In a real app, this would be a fetch call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response
      return {
        user: {
          id: '1',
          name: data.name,
          email: data.email,
          role: 'user'
        },
        token: 'mock-jwt-token'
      };
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
