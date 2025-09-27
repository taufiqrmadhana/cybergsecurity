'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const REGISTER_ENDPOINT = `${API_BASE_URL}/api/auth/register`;

export const SignupForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    terms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.terms) {
      setError('You must agree to the terms and privacy policy.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.post(
        REGISTER_ENDPOINT,
        {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess('Account created successfully!')
      }
      
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.detail || 'Registration failed. Please try again.';
        setError(errorMessage);
      } else {
        setError('A network error occurred. Could not connect to the API.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen overflow-y-auto bg-white p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create an Account
          </h1>
          <p className="text-gray-500">Register your organization</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div
              className="p-3 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="p-3 text-sm text-green-700 bg-green-100 rounded-lg"
              role="status"
            >
              {success}
            </div>
          )}

          <Input
            id="full_name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            required
            value={formData.full_name}
            onChange={handleInputChange}
          />
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
            placeholder="Create a password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <Input
            id="role"
            label="Role"
            type="text"
            placeholder="Enter role (e.g., user or admin)"
            required
            value={formData.role}
            onChange={handleInputChange}
          />

          <div className="flex items-start gap-3 pt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={formData.terms}
              onChange={handleInputChange}
              className="h-4 w-4 mt-1 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded cursor-pointer"
              required
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-700 cursor-pointer"
            >
              I agree to the{' '}
              <a
                href="#"
                className="font-medium text-indigo-500 hover:underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="font-medium text-indigo-500 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
