
"use client";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; 
import '../globals.css'; 
import { Toaster } from "@/components/ui/toaster";
import NeoCartHeader from '@/components/neocart/NeoCartHeader';
import NeoCartFooter from '@/components/neocart/NeoCartFooter';
import SupportChatWidget from '@/components/neocart/SupportChatWidget';
import { useState } from 'react';

const inter = Inter({ 
  subsets: ['latin'],
});

// Metadata can't be dynamically set in client components in the same way as server components.
// For client layouts, it's often better to set metadata in parent server components or page.tsx files.
// However, if this layout is the root for this section, this is acceptable.
// export const metadata: Metadata = {
// title: 'SmartOrder by NeoCart - Efficient E-commerce Order Management',
// description: 'SmartOrder helps businesses manage, fulfill, and track online orders efficiently with its smart e-commerce plugin.',
// };

export default function NeoCartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  return (
    <html lang="en" className={`${inter.className} light`} style={{ colorScheme: 'light', scrollBehavior: 'smooth' }}> 
      <body className={`antialiased bg-slate-50 text-slate-800 flex flex-col min-h-screen`}>
        <NeoCartHeader onFAQClick={handleOpenChat} />
        <main className="flex-1">
          {children}
        </main>
        <NeoCartFooter />
        <SupportChatWidget isOpen={isChatOpen} onToggle={handleToggleChat} />
        <Toaster />
      </body>
    </html>
  );
}
