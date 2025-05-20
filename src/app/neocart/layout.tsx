"use client";

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
    <div className={`${inter.className} flex flex-col min-h-screen antialiased bg-slate-50 text-slate-800`}>
      <NeoCartHeader onFAQClick={handleOpenChat} />
      <main className="flex-1">
        {children}
      </main>
      <NeoCartFooter />
      <SupportChatWidget isOpen={isChatOpen} onToggle={handleToggleChat} />
      <Toaster />
    </div>
  );
}