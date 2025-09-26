'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;

export const LoginForm = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post(LOGIN_ENDPOINT, {
        email: formData.email,
        password: formData.password,
      });

      // 1. Store the token from the response body into localStorage
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('access_token', access_token);
      }

      setSuccess('Login successful! Redirecting...');
      
      // 2. Redirect to the dashboard
      router.push('/pages/dashboard/overview');

    } catch (err) {
      // 3. Adjust error message handling based on your API structure
      if (axios.isAxiosError(err) && err.response) {
        // Your API returns the error message in the 'detail' field for 401
        const errorMessage = err.response.data.detail || 'Login failed. Check server status.';
        setError(errorMessage);
        console.error('Login Error:', err.response.data);
      } else {
        setError('A network error occurred. Could not connect to the API.');
        console.error('Network Error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">
            Please sign in to your account.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="status">
              {success}
            </div>
          )}

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-indigo-500 hover:text-indigo-600">
              Forgot password?
            </a>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Login'}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/auth/signup" className="font-medium text-indigo-500 hover:text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};