
"use client";

import React, { useState } from 'react';
import SmartOrderQueryForm from './SmartOrderQueryForm';
import { submitUserQuery } from '@/app/neocart/smartorder/actions';
import { useToast } from "@/hooks/use-toast";
import type { SmartOrderQueryFormData } from './SmartOrderQueryForm'; // Corrected import path
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function ContactSection() {
  // const [isFormVisible, setIsFormVisible] = useState(true); // Default to visible - form is now always visible
  const { toast } = useToast();

  const handleFormSubmit = async (data: SmartOrderQueryFormData) => {
    try {
      const result = await submitUserQuery(data);
      if (result.success) {
        toast({
          title: "Query Submitted Successfully!",
          description: "Thank you for reaching out. We'll get back to you as soon as possible.",
          variant: "default", 
        });
        // setIsFormVisible(false); // Form is always visible now
      } else {
        throw new Error(result.error || "Submission failed due to an unknown error.");
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Could not submit your query. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-background dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">Have a Question or Ready to Start?</h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-6 max-w-2xl mx-auto">
            We're here to help. Fill out the form below to learn more about SmartOrder, request a demo, or discuss your specific e-commerce needs.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-card dark:bg-dark-card dark:border dark:border-slate-700 p-8 md:p-10 rounded-xl shadow-2xl dark:shadow-primary/10">
            <SmartOrderQueryForm onSubmit={handleFormSubmit} />
        </div>

      </div>
    </section>
  );
}

