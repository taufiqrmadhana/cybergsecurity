'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Toast = ({ message, show, onClose }: ToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in-up z-50">
      <span>{message}</span>
      <button onClick={onClose} className="hover:bg-teal-600 p-1 rounded-full cursor-pointer">
        <X size={20} />
      </button>
    </div>
  );
};

export default Toast;