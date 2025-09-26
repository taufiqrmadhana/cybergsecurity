'use client';

import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const LoginForm = () => {
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

        <form className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-indigo-500 hover:text-indigo-600">
              Forgot password?
            </a>
          </div>

          <div className="pt-2">
            <Button type="submit">
              Login
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