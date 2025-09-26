'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';


const data = [
  { 
    name: 'Layanan TI', 
    fullName: 'Layanan Teknologi Informasi',
    value: 245, 
    percentage: 18.2,
    color: '#fa7415', 
    description: 'Kontrak terkait layanan dan infrastruktur teknologi informasi.'
  },
  { 
    name: 'Pengadaan', 
    fullName: 'Pengadaan Barang dan Jasa',
    value: 189, 
    percentage: 14.1,
    color: '#9bb4ff',
    description: 'Mencakup semua pengadaan barang dan jasa untuk operasional.'
  },
  { 
    name: 'Kemitraan', 
    fullName: 'Kemitraan Global',
    value: 312, 
    percentage: 23.2,
    color: '#5262ff', 
    description: 'Perjanjian kerjasama strategis dengan mitra internasional.'
  },
  { 
    name: 'Logistik', 
    fullName: 'Integrasi Logistik',
    value: 398, 
    percentage: 29.6,
    color: '#21247e',
    description: 'Kontrak untuk integrasi dan manajemen rantai pasok.'
  },
  { 
    name: 'Kepelabuhan', 
    fullName: 'Jasa Kepelabuhan Digital',
    value: 201, 
    percentage: 14.9,
    color: '#fed8aa', 
    description: 'Layanan digital untuk operasional dan manajemen pelabuhan.'
  },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { fullName: string; value: number; percentage: number; color: string; }; }>;
}
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-semibold text-gray-900">{data.fullName}</span>
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-xl text-gray-900">Contract Categories</h3>
              <p className="text-sm text-gray-600 mt-1">
                Distribution across service types
              </p>
            </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1 text-sm">
            {['Overview', 'Details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium cursor-pointer ${
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
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600">
            Total Contracts: <span className="font-semibold text-gray-900">{totalContracts.toLocaleString()}</span>
          </div>
          <div className="text-sm text-gray-600">
            Categories: <span className="font-semibold text-gray-900">{data.length}</span>
          </div>
        </div>
      </div>

      <div key={activeTab} className="p-6 flex-1 animate-fade-in">
        {activeTab === 'Overview' && (
          <div className="h-full w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }} barCategoryGap="25%">
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} angle={-45} textAnchor="end" height={80}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, maxValue * 1.1]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} onMouseEnter={(_, index) => setHoveredBar(index)} onMouseLeave={() => setHoveredBar(null)}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="transition-all duration-300"
                      style={{
                        filter: hoveredBar === index ? 'brightness(1.15)' : 'brightness(1)',
                        transform: hoveredBar === index ? 'scaleY(1.02)' : 'scaleY(1)',
                        transformOrigin: 'bottom'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {activeTab === 'Details' && (
          <div className="space-y-6 pr-2">
            {data.map(item => (
              <div key={item.name}>
                <div className="grid grid-cols-12 items-center gap-4 group">
                    <div className="col-span-4">
                      <p className="font-semibold text-sm text-slate-800 truncate">{item.fullName}</p>
                    </div>
                    <div className="col-span-5 flex items-center">
                      <div className="w-full bg-slate-100 rounded-full h-2 group-hover:bg-slate-200 transition">
                        <div 
                          className="h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                    <div className="col-span-3 grid grid-cols-2 gap-2 text-sm text-right">
                      <p className="font-medium text-slate-600">{item.value.toLocaleString()}</p>
                      <p className="font-bold text-slate-800">{item.percentage}%</p>
                    </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 col-span-12 pl-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};