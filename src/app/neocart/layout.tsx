
import type { Metadata } from 'next';
import { Geist_Sans } from 'next/font/google'; // Corrected import
import '../globals.css'; 
import { Toaster } from "@/components/ui/toaster";
import NeoCartHeader from '@/components/neocart/NeoCartHeader';
import NeoCartFooter from '@/components/neocart/NeoCartFooter';
import SupportChatWidget from '@/components/neocart/SupportChatWidget'; // Import the chat widget

const geistSans = Geist_Sans({ // Use the correct variable name
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
    // Ensure light theme is applied for NeoCart pages, and smooth scroll
    <html lang="en" className="light" style={{ colorScheme: 'light', scrollBehavior: 'smooth' }}> 
      <body className={`${geistSans.variable} font-sans antialiased bg-slate-50 text-slate-800 flex flex-col min-h-screen`}>
        <NeoCartHeader />
        <main className="flex-1">
          {children}
        </main>
        <NeoCartFooter />
        <SupportChatWidget /> {/* Add the chat widget here */}
        <Toaster />
      </body>
    </html>
  );
}

    