import { Sidebar } from '@/app/components/layout/sidebar'; 

export default function DashboardSpecificLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full"> 
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}