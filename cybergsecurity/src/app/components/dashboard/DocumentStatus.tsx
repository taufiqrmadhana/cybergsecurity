'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const data = [
  { 
    name: 'Layanan TI', 
    fullName: 'Layanan Teknologi Informasi',
    value: 245, 
    percentage: 18.2,
    color: '#5262ff' 
  },
  { 
    name: 'Pengadaan', 
    fullName: 'Pengadaan Barang dan Jasa',
    value: 189, 
    percentage: 14.1,
    color: '#9bb4ff' 
  },
  { 
    name: 'Kemitraan', 
    fullName: 'Kemitraan Global',
    value: 312, 
    percentage: 23.2,
    color: '#fa7415' 
  },
  { 
    name: 'Logistik', 
    fullName: 'Integrasi Logistik',
    value: 398, 
    percentage: 29.6,
    color: '#21247e' 
  },
  { 
    name: 'Kepelabuhan', 
    fullName: 'Jasa Kepelabuhan Digital',
    value: 201, 
    percentage: 14.9,
    color: '#c1d2ff' 
  },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      fullName: string;
      value: number;
      percentage: number;
      color: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-gray-900">
            {data.fullName}
          </span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Contracts:</span>
            <span className="font-bold text-gray-900">{data.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Percentage:</span>
            <span className="font-bold text-gray-900">{data.percentage}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const DocumentStatusChart = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const totalContracts = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-bold text-xl text-gray-900">Contract Categories</h3>
              <p className="text-sm text-gray-600 mt-1">
                Distribution across service types
              </p>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1 text-sm">
            {['Overview', 'Details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                  activeTab === tab 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600">
            Total Contracts: <span className="font-semibold text-gray-900">{totalContracts.toLocaleString()}</span>
          </div>
          <div className="text-sm text-gray-600">
            Categories: <span className="font-semibold text-gray-900">{data.length}</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barCategoryGap="25%"
            >
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, maxValue * 1.1]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]}
                onMouseEnter={(_, index) => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: hoveredBar === index ? 'brightness(1.1)' : 'none',
                      transition: 'all 0.3s ease',
                      transformOrigin: 'bottom',
                      transform: hoveredBar === index ? 'scaleY(1.02)' : 'scaleY(1)'
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};