'use client';

import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  change: string;
  Icon: LucideIcon;
  iconBgColor: string;
  changeIcon: React.ReactNode;
};

export const StatCard = ({ title, value, description, change, Icon, iconBgColor, changeIcon }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-light)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-dark)]">{title}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBgColor}`}>
          <Icon className="h-4 w-4 text-[var(--color-grey-dark)]" />
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