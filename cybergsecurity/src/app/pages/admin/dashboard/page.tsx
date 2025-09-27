'use client';

import React from 'react';
import { SignupForm } from '@/app/components/auth/SignupForm';

const AdminDashboardPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">

      {/* Embed the signup form directly here */}
      <div className="w-full max-w-2xl bg-white shadow rounded-lg p-6">
        <SignupForm />
      </div>
    </main>
  );
};

export default AdminDashboardPage;
