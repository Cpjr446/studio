
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button is desired
import { ShoppingBag } from 'lucide-react'; // Example Icon

export default function NeoCartHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/neocart/smartorder" className="flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold text-primary">NeoCart</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/neocart/smartorder#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/neocart/smartorder#contact" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            Contact
          </Link>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/neocart/smartorder#contact">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
