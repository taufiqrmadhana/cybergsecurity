'use client';

import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  change: string;
  Icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  changeIcon: React.ReactNode;
};

export const StatCard = ({ title, value, description, change, Icon, iconBgColor, iconColor, changeIcon }: StatCardProps) => {
  return (
    <div className="
      bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4
      transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg hover:border-slate-300
    ">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-[var(--color-blue-darkest)]">{title}</span>
        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${iconBgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-dark)]">{value}</h2>
        <p className="text-sm text-[var(--color-grey-dark)]">{description}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-[var(--color-grey-dark)]">
        {changeIcon}
        <span>{change}</span>
      </div>
    </div>
  );
};