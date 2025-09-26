'use client';

import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const features = [
  'AI-Powered Contract Analysis',
  'Automated Workflow Management',
  'Real-time Collaboration',
];

export const InfoPanel = () => {
  return (
    <div className="relative hidden lg:flex flex-col justify-center w-1/2 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500 p-12 text-white overflow-hidden">
      
      <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 bg-opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-60 right-10 w-32 h-32 bg-orange-100 bg-opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-15 left-30 w-32 h-32 bg-orange-200 bg-opacity-10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full">
        
        {/* Logo and Title */}
        <div className="mb-2">
           <Image 
             src='/images/logo.svg' 
             alt="NeoContract Logo" 
             width={300}
             height={75} 
             className="w-48" 
           />
        </div>
        
        {/* Description */}
        <p className="text-xl mb-2 text-white font-light">
          Modern Agentic Contract Management System
        </p>
        <p className="text-lg mb-9 text-indigo-100 opacity-90">
          Streamline your contract workflows with intelligent automation and comprehensive management tools.
        </p>
        
        {/* Features List */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg text-white">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};