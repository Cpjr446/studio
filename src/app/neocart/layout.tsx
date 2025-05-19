
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../globals.css'; // We can reuse some base styles, but override for light theme
import { Toaster } from "@/components/ui/toaster";
import NeoCartHeader from '@/components/neocart/NeoCartHeader';
import NeoCartFooter from '@/components/neocart/NeoCartFooter';

const geistSans = Geist({ 
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SmartOrder by NeoCart - Efficient E-commerce Order Management',
  description: 'SmartOrder helps businesses manage, fulfill, and track online orders efficiently with its smart e-commerce plugin.',
};

export default function NeoCartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}> {/* Enforce light theme */}
      <body className={`${geistSans.variable} font-sans antialiased bg-white text-slate-800 flex flex-col min-h-screen`}>
        <NeoCartHeader />
        <main className="flex-1">
          {children}
        </main>
        <NeoCartFooter />
        <Toaster />
      </body>
    </html>
  );
}
