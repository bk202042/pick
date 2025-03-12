import React from 'react';

export default function AuthPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
    </div>
  );
}
