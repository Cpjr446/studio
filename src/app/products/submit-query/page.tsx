
// src/app/products/submit-query/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubmitQueryForm from '@/components/query/submit-query-form';
import type { NewProductQueryData } from '@/types/support'; // Assuming QueryFormData is compatible

export default function SubmitProductQueryPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (formData: any) => { // formData comes from react-hook-form
    const newQuery: NewProductQueryData = {
      id: `prod_inq_${Date.now()}`,
      timestamp: new Date().toISOString(),
      submitterName: formData.name,
      submitterEmail: formData.email,
      queryTopic: formData.queryTopic,
      urgencyLevel: formData.urgencyLevel, // This should be part of formData from SubmitQueryForm
      message: formData.message,
    };

    // Retrieve existing queries from localStorage or initialize an empty array
    const existingQueriesString = localStorage.getItem('newProductQueries');
    const existingQueries: NewProductQueryData[] = existingQueriesString ? JSON.parse(existingQueriesString) : [];
    
    // Add the new query and save back to localStorage
    existingQueries.push(newQuery);
    localStorage.setItem('newProductQueries', JSON.stringify(existingQueries));
    
    setIsSubmitted(true);
    // Optionally, you could redirect here: router.push('/');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-8 text-center">
        <CheckCircle className="h-16 w-16 text-success mb-4" />
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
          Product Query Submitted!
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Thank you for your submission. Your query has been received and will appear in the main dashboard.
        </p>
        <Link href="/" passHref>
          <Button variant="default" size="lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

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
          Submit a Product Query
        </h1>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          Have a question or feedback about one of our products? Let us know below.
        </p>
        <SubmitQueryForm onSubmit={handleSubmit} />
      </main>
      <footer className="w-full max-w-2xl mt-8 text-center">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SupportPal AI Products</p>
      </footer>
    </div>
  );
}
