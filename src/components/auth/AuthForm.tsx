import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '../../store/authSlice';
import type { LoginCredentials, RegisterData } from '../../types/auth';
import { AppDispatch } from '../../store/store';

interface AuthFormProps {
  mode: 'login' | 'register';
  onClose: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<RegisterData> & { general?: string }>({});

  const validateForm = () => {
    const newErrors: Partial<RegisterData> = {};
    if (mode === 'register' && !formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (mode === 'login') {
          const loginData: LoginCredentials = {
            email: formData.email,
            password: formData.password
          };
          await dispatch(login(loginData)).unwrap();
        } else {
          await dispatch(register(formData)).unwrap();
        }
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          setErrors({ general: error.message });
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: RegisterData) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {errors.general}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } shadow-sm p-2 focus:border-primary focus:ring-primary sm:text-sm`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } shadow-sm p-2 focus:border-primary focus:ring-primary sm:text-sm`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } shadow-sm p-2 focus:border-primary focus:ring-primary sm:text-sm`}
              placeholder="••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => onClose()}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Cancel
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
