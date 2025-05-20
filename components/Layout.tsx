
import { ReactNode } from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-white border-r pt-6 px-4">
        <h2 className="font-bold text-xl mb-8">RecruitAI</h2>
        <nav className="space-y-2">
          <Link className="block hover:font-medium" href="/">Home</Link>
          <Link className="block hover:font-medium" href="/dashboard">Dashboard</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
