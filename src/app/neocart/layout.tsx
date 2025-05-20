
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist_Sans to Inter
import '../globals.css'; 
import { Toaster } from "@/components/ui/toaster";
import NeoCartHeader from '@/components/neocart/NeoCartHeader';
import NeoCartFooter from '@/components/neocart/NeoCartFooter';
import SupportChatWidget from '@/components/neocart/SupportChatWidget';

// Initialize Inter font
const inter = Inter({ 
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
    // Apply Inter font class to the html tag for NeoCart pages
    // Ensure light theme is applied for NeoCart pages, and smooth scroll
    <html lang="en" className={`${inter.className} light`} style={{ colorScheme: 'light', scrollBehavior: 'smooth' }}> 
      <body className={`antialiased bg-slate-50 text-slate-800 flex flex-col min-h-screen`}>
        <NeoCartHeader />
        <main className="flex-1">
          {children}
        </main>
        <NeoCartFooter />
        <SupportChatWidget />
        <Toaster />
      </body>
    </html>
  );
}
