'use client';

import { StatCard } from '@/app/components/dashboard/StatCard';
import { DocumentStatusChart } from '@/app/components/dashboard/DocumentStatus';
import { DeadlineList } from '@/app/components/dashboard/DeadlineList';
import { ArrowUp, Plus, Eye, FileSearch, AlertTriangle, CheckCircle } from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-dark)]">Dashboard</h1>
          <p className="mt-1 text-[var(--color-grey-dark)]">
            Welcome back! Here is whats happening with your contracts.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="NEW"
          value="45"
          description="New Contracts"
          change="8 new today"
          Icon={Plus}
          iconBgColor="bg-[var(--color-blue-lightest)]"
          changeIcon={<ArrowUp className="h-3 w-3 text-green-600" />}
        />
        <StatCard 
          title="VERIFICATION"
          value="23"
          description="On Verification"
          change="5% from last week"
          Icon={Eye}
          iconBgColor="bg-[var(--color-accent-lightest)]"
          changeIcon={<ArrowUp className="h-3 w-3 text-green-600" />}
        />
        <StatCard 
          title="REVIEW"
          value="67"
          description="On Review"
          change="12 in progress"
          Icon={FileSearch}
          iconBgColor="bg-blue-50"
          changeIcon={<ArrowUp className="h-3 w-3 text-blue-600" />}
        />
        <StatCard 
          title="CONFLICT"
          value="8"
          description="Conflicts Found"
          change="3 new issues"
          Icon={AlertTriangle}
          iconBgColor="bg-red-50"
          changeIcon={<ArrowUp className="h-3 w-3 text-red-600" />}
        />
        <StatCard 
          title="ACCEPTED"
          value="1,248"
          description="Accepted Contracts"
          change="18% completion rate"
          Icon={CheckCircle}
          iconBgColor="bg-green-50"
          changeIcon={<ArrowUp className="h-3 w-3 text-green-600" />}
        />
      </div>

      {/* Bagian Bawah: Chart dan Daftar Deadline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentStatusChart />
        </div>
        <div>
          <DeadlineList />
        </div>
      </div>
    </div>
  );
}