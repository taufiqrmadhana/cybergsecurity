import { Navbar } from '@/app/components/layout/navbar';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 overflow-hidden bg-gray-100">
        {children}
      </main>
    </div>
  );
}