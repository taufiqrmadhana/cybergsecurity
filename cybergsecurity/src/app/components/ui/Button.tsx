'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`
        w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-3xl
        hover:bg-blue-800 transition-all duration-300 ease-in-out cursor-pointer
        focus:bg-blue-700
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};