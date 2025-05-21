
"use client";

import '../globals.css'; // Assuming this contains Tailwind base and dark mode utilities
import { Toaster } from "@/components/ui/toaster";
import NeoCartHeader from '@/components/neocart/NeoCartHeader';
import NeoCartFooter from '@/components/neocart/NeoCartFooter';
import SupportChatWidget from '@/components/neocart/SupportChatWidget';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function NeoCartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the html tag has the 'dark' class
    const rootHasDarkClass = document.documentElement.classList.contains('dark');
    setIsDarkMode(rootHasDarkClass);
  }, []);
  
  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  };
  
  const handleOpenChat = () => {
    setIsChatOpen(true);
  };
  
  return (
    // Apply inter font, flex layout, and use Tailwind dark mode variants
    // NeoCart pages will primarily be light by default unless html has 'dark'
    <div 
      className={cn(
        'font-sans flex flex-col min-h-screen antialiased',
        // Default to light theme for NeoCart content area
        'bg-[hsl(var(--background))] text-slate-800', 
        // Apply dark theme styles if html.dark is present
        'dark:bg-slate-900 dark:text-slate-200' 
      )}
    >
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
