import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rascacielo Digital - SaaS Platform',
  description: 'Production-ready SaaS with Next.js 16+, Supabase, and Post-Quantum Security'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
