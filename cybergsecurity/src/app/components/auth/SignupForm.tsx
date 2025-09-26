'use client';

import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const SignupForm = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create an Account
          </h1>
          <p className="text-gray-500">
            Join NeoContract to streamline your workflows.
          </p>
        </div>

        <form className="space-y-5"> 
          <Input
            id="fullName"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            required
          />
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
            placeholder="Create a password"
            required
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
          />

          <div className="flex items-start gap-3 pt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 mt-1 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded cursor-pointer"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
              I agree to the{' '}
              <a href="#" className="font-medium text-indigo-500 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-indigo-500 hover:underline">
                Privacy Policy
              </a>.
            </label>
          </div>

          <div className="pt-2">
            <Button type="submit">
              Create Account
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/auth/login" className="font-medium text-indigo-500 hover:text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};