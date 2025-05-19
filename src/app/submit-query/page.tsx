
// src/app/submit-query/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubmitQueryForm from '@/components/query/submit-query-form'; // Ensure this path is correct

export default function SubmitQueryPage() {
  const handleSubmit = (data: any) => {
    // In a real app, you'd send this data to your backend/API
    console.log('Query submitted:', data);
    // Optionally, navigate the user or show a success message
    // For now, we'll just log it.
    alert('Query submitted (see console for data). This page is a UI example.');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-2xl mb-8">
        <Link href="/" passHref>
          <Button variant="outline" size="sm" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </header>
      <main className="w-full max-w-2xl bg-card p-6 md:p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 text-center">
          Submit a New Support Query
        </h1>
        <SubmitQueryForm onSubmit={handleSubmit} />
      </main>
      <footer className="w-full max-w-2xl mt-8 text-center">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SupportPal AI</p>
      </footer>
    </div>
  );
}

    