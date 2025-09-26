'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input = ({ label, id, ...props }: InputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-800 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`
          w-full px-4 py-3 border border-gray-400 rounded-2xl
            text-gray-900 placeholder-gray-400 focus:outline-none 
          focus:ring-2 focus:ring-indigo-400 focus:border-transparent
          transition-all duration-300
        `}
        {...props}
      />
    </div>
  );
};