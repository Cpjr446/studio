
"use client";

import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/layout/app-layout";
import InquiryDetailView from "@/components/inquiry/inquiry-detail-view";
import { mockUserProfile, mockInquiries, mockCustomers } from "@/lib/mock-data";
import type { Inquiry, Customer } from "@/types/support";
import { prioritizeInquiry } from "@/ai/flows/prioritize-inquiries";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Inbox } from "lucide-react";

export default function SupportPalDashboard() {
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  // Initialize with isLoadingPriority true for all mock inquiries initially
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries.map(inq => ({...inq, isLoadingPriority: true })));
  const [customers] = useState<Customer[]>(mockCustomers);
  const [userProfile] = useState(mockUserProfile);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    const fetchAllPriorities = async () => {
      const updatedInquiriesPromises = mockInquiries.map(async (inq) => {
        try {
          const priority = await prioritizeInquiry({ inquiry: `${inq.subject} ${inq.previewText}` });
          return { ...inq, priority, isLoadingPriority: false };
        } catch (error) {
          console.error(`Failed to prioritize inquiry ${inq.id}:`, error);
          return { ...inq, priority: undefined, isLoadingPriority: false }; 
        }
      });
      
      const resolvedInquiries = await Promise.all(updatedInquiriesPromises);
      setInquiries(resolvedInquiries);
      setIsLoadingPage(false);

      if (resolvedInquiries.length > 0) {
        // Sort before selecting the first one from the sorted list
        const sorted = [...resolvedInquiries].sort((a, b) => (b.priority?.priorityScore || 0) - (a.priority?.priorityScore || 0));
        setSelectedInquiryId(sorted[0].id);
      }
    };

    fetchAllPriorities();
  }, []); // Runs once on mount


  const sortedInquiries = useMemo(() => {
    return [...inquiries].sort((a, b) => {
      const scoreA = a.priority?.priorityScore || 0;
      const scoreB = b.priority?.priorityScore || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA; // Higher score first
      }
      // If scores are equal, sort by timestamp (older first)
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }, [inquiries]);

  const selectedInquiry = inquiries.find(inq => inq.id === selectedInquiryId);
  const selectedCustomer = selectedInquiry ? customers.find(cust => cust.id === selectedInquiry.customerId) : undefined;

  const handleSelectInquiry = (id: string) => {
    setSelectedInquiryId(id);
  };

  const handleBackToList = () => {
    setSelectedInquiryId(null); 
  }

  if (isLoadingPage && inquiries.every(inq => inq.isLoadingPriority)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading inquiries & AI priorities...</p>
        </div>
      </div>
    );
  }
  

  return (
    <AppLayout
      userProfile={userProfile}
      inquiries={sortedInquiries} // Use sorted inquiries
      customers={customers}
      selectedInquiryId={selectedInquiryId}
      onSelectInquiry={handleSelectInquiry}
    >
      {selectedInquiry && selectedCustomer ? (
        <InquiryDetailView
          inquiry={selectedInquiry}
          customer={selectedCustomer}
          currentUser={userProfile}
          onBackToList={handleBackToList}
        />
      ) : sortedInquiries.length > 0 && !selectedInquiryId ? (
         // This case might be less frequent if an inquiry is auto-selected
         <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
            <Inbox className="h-16 w-16 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Welcome to SupportPal AI</h2>
            <p className="max-w-md">
              Select an inquiry from the sidebar to view details, manage conversations, and leverage AI-powered assistance.
            </p>
          </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
          <AlertTriangle className="h-16 w-16 mb-4 text-destructive" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Inquiries Available</h2>
          <p className="max-w-md">
            There are currently no inquiries to display, or an error occurred while loading them.
          </p>
        </div>
      )}
    </AppLayout>
  );
}
