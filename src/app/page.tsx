
"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/app-layout";
import InquiryDetailView from "@/components/inquiry/inquiry-detail-view";
import { mockUserProfile, mockInquiries, mockCustomers } from "@/lib/mock-data";
import type { Inquiry, Customer } from "@/types/support";
import { prioritizeInquiry } from "@/ai/flows/prioritize-inquiries";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Inbox } from "lucide-react";

export default function SupportPalDashboard() {
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries.map(inq => ({...inq, isLoadingPriority: true })));
  const [customers] = useState<Customer[]>(mockCustomers);
  const [userProfile] = useState(mockUserProfile);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    // Simulate initial data loading and priority fetching for all inquiries
    const fetchAllPriorities = async () => {
      const updatedInquiries = await Promise.all(
        mockInquiries.map(async (inq) => {
          try {
            const priority = await prioritizeInquiry({ inquiry: `${inq.subject} ${inq.previewText}` });
            return { ...inq, priority, isLoadingPriority: false };
          } catch (error) {
            console.error(`Failed to prioritize inquiry ${inq.id}:`, error);
            return { ...inq, priority: undefined, isLoadingPriority: false }; // Handle error for individual inquiry
          }
        })
      );
      setInquiries(updatedInquiries);
      setIsLoadingPage(false);
      // Auto-select the first inquiry if available
      if (updatedInquiries.length > 0) {
        setSelectedInquiryId(updatedInquiries[0].id);
      }
    };

    fetchAllPriorities();
  }, []);


  const selectedInquiry = inquiries.find(inq => inq.id === selectedInquiryId);
  const selectedCustomer = selectedInquiry ? customers.find(cust => cust.id === selectedInquiry.customerId) : undefined;

  const handleSelectInquiry = (id: string) => {
    setSelectedInquiryId(id);
  };

  const handleBackToList = () => {
    setSelectedInquiryId(null); // Or navigate, depending on layout for mobile
  }

  if (isLoadingPage && inquiries.every(inq => inq.isLoadingPriority)) {
    // Basic page loading skeleton
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }
  

  return (
    <AppLayout
      userProfile={userProfile}
      inquiries={inquiries}
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
      ) : inquiries.length > 0 && !selectedInquiryId ? (
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
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Inquiry Selected or Found</h2>
          <p className="max-w-md">
            Please select an inquiry from the list on the left. If the list is empty, there might be no inquiries matching your current filters or an error occurred.
          </p>
        </div>
      )}
    </AppLayout>
  );
}
