
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Zap, HelpCircle } from 'lucide-react'; 

interface NeoCartHeaderProps {
  onFAQClick: () => void;
}

export default function NeoCartHeader({ onFAQClick }: NeoCartHeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/neocart/smartorder" className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-primary dark:text-primary-foreground">NeoCart</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/neocart/smartorder#features" className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-foreground transition-colors">
            Features
          </Link>
          <Link href="/neocart/smartorder#why-choose-us" className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-foreground transition-colors">
            Why Us
          </Link>
          <Link href="/neocart/smartorder#contact" className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-foreground transition-colors">
            Contact
          </Link>
          <Button 
            variant="default" // Changed to default to match "Get Started"
            onClick={onFAQClick} 
            className="text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground px-5 py-2.5"
          >
            <HelpCircle className="h-5 w-5 mr-2" />
            FAQ
          </Button>
          <Button asChild size="md" className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground font-semibold px-6 py-2.5">
            <Link href="/neocart/smartorder#contact">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

