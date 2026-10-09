'use client';

import { RhSubNav } from '@/components/rh/RhSubNav';

export function RhClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-6 py-6 md:px-8 space-y-6">
      <RhSubNav />
      <div>{children}</div>
    </div>
  );
}
