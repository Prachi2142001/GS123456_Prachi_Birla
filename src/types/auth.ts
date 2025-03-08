export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}
