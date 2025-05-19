
"use client";

import React, { useState } from 'react';
import SmartOrderQueryForm from './SmartOrderQueryForm';
import { submitUserQuery } from '@/app/neocart/smartorder/actions';
import { useToast } from "@/hooks/use-toast";
import type { SmartOrderQueryFormData } from './SmartOrderQueryForm'; // Import the type

export default function ContactSection() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: SmartOrderQueryFormData) => {
    try {
      const result = await submitUserQuery(data);
      if (result.success) {
        toast({
          title: "Query Submitted!",
          description: "Thank you for your message. We'll get back to you soon.",
          variant: "default", // success variant if you have one
        });
        setIsFormVisible(false); // Hide form on success
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Could not submit your query. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Have a question?</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
          We're here to help. Reach out to learn more about SmartOrder or to discuss your specific needs.
        </p>
        {!isFormVisible ? (
          <button
            onClick={() => setIsFormVisible(true)}
            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors text-lg"
          >
            Submit a Query
          </button>
        ) : (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl text-left">
            <SmartOrderQueryForm onSubmit={handleFormSubmit} />
            <button
                onClick={() => setIsFormVisible(false)}
                className="mt-4 text-sm text-slate-600 hover:text-primary"
            >
                Cancel
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
