import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import { LoginCredentials } from '../../types/auth';
import { AppDispatch } from '../../store/store';

const SignIn: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  const validateForm = () => {
    const newErrors: Partial<LoginCredentials> = {};
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
        await dispatch(login(formData)).unwrap();
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          setErrors({ password: error.message });
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginCredentials) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginCredentials]) {
      setErrors((prev: Partial<LoginCredentials>) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
