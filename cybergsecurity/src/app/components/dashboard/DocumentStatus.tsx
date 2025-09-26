'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Drafting', value: 12.5 },
  { name: 'In Review', value: 7.1 },
  { name: 'Approved', value: 18.8 },
  { name: 'Signed', value: 35.7 },
  { name: 'Archived', value: 25.9 },
];

const COLORS = ['#5262ff', '#fa7415', '#9bb4ff', '#21247e', '#c1d2ff'];

const renderLegend = (props: { payload?: { color?: string; value?: string }[] }) => {
  const { payload } = props;
  
  if (!payload) return null;
  return (
    <ul className="flex flex-col gap-2">
      {payload.map((entry, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-slate-600">{entry.value}</span>
          <span className="text-sm font-bold text-slate-800">{`${data[index].value}%`}</span>
        </li>
      ))}
    </ul>
  );
};

export const DocumentStatusChart = () => {
  const [activeTab, setActiveTab] = useState('7 Days');

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-slate-800">Document Status Overview</h3>
        <div className="flex items-center bg-slate-100 rounded-lg p-1 text-sm">
          {['7 Days', '30 Days', '90 Days'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === tab ? 'bg-white text-blue-default shadow-sm' : 'text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center h-[250px]">
        <ResponsiveContainer width="50%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="w-1/2">
            <Legend content={renderLegend as never} />
        </div>
      </div>
    </div>
  );
};