
"use client";

import { useState, useEffect, useMemo } from "react";
import AppSidebarContent from "@/components/layout/app-sidebar-content";
import InquiryDetailView from "@/components/inquiry/inquiry-detail-view";
import AppHeader from "@/components/layout/app-header";
import { mockUserProfile, mockInquiries, mockCustomers } from "@/lib/mock-data";
import type { Inquiry, Customer } from "@/types/support";
import { prioritizeInquiry } from "@/ai/flows/prioritize-inquiries";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Inbox, PanelLeftOpen, X } from "lucide-react"; // Added X for closing mobile inbox
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile"; // Hook to detect mobile
import { cn } from "@/lib/utils";


export default function SupportPalDashboard() {
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries.map(inq => ({...inq, isLoadingPriority: true })));
  const [customers] = useState<Customer[]>(mockCustomers);
  const [userProfile] = useState(mockUserProfile);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const isMobile = useIsMobile();
  const [isMobileInboxOpen, setIsMobileInboxOpen] = useState(false);

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
        const sorted = [...resolvedInquiries].sort((a, b) => (b.priority?.priorityScore || 0) - (a.priority?.priorityScore || 0));
        if (!isMobile) { // Auto-select first inquiry on desktop
             setSelectedInquiryId(sorted[0].id);
        }
      }
    };

    fetchAllPriorities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    // Close mobile inbox when an inquiry is selected
    if (isMobile && selectedInquiryId) {
      setIsMobileInboxOpen(false);
    }
  }, [selectedInquiryId, isMobile]);


  const sortedInquiries = useMemo(() => {
    return [...inquiries].sort((a, b) => {
      const scoreA = a.priority?.priorityScore || 0;
      const scoreB = b.priority?.priorityScore || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA; 
      }
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }, [inquiries]);

  const selectedInquiry = inquiries.find(inq => inq.id === selectedInquiryId);
  const selectedCustomer = selectedInquiry ? customers.find(cust => cust.id === selectedInquiry.customerId) : undefined;

  const handleSelectInquiry = (id: string) => {
    setSelectedInquiryId(id);
    if (isMobile) {
      setIsMobileInboxOpen(false);
    }
  };

  const handleBackToList = () => { // Used by InquiryDetailView on mobile to go back to inbox
    setSelectedInquiryId(null); 
    if (isMobile) {
      setIsMobileInboxOpen(true);
    }
  }

  if (isLoadingPage && inquiries.every(inq => inq.isLoadingPriority)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto bg-muted" />
          <Skeleton className="h-6 w-48 mx-auto bg-muted" />
          <Skeleton className="h-4 w-64 mx-auto bg-muted" />
          <p className="text-sm text-muted-foreground">Loading inquiries & AI priorities...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel (Inbox) */}
      <div className={cn(
        "md:w-[30%] md:flex flex-col h-full shrink-0",
        isMobile ? (isMobileInboxOpen ? "w-full absolute inset-0 z-40 bg-sidebar" : "hidden") : "relative"
      )}>
        {isMobile && isMobileInboxOpen && (
            <div className="p-4 border-b border-sidebar-border flex justify-end sticky top-0 bg-sidebar z-10">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileInboxOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
        )}
        <AppSidebarContent
          inquiries={sortedInquiries}
          customers={customers}
          selectedInquiryId={selectedInquiryId}
          onSelectInquiry={handleSelectInquiry}
        />
      </div>

      {/* Right Panel (Conversation & Info) */}
      <div className={cn(
          "flex-1 flex flex-col h-full overflow-hidden",
          isMobile && selectedInquiryId === null && !isMobileInboxOpen ? "hidden" : "", // Hide if mobile and no inquiry selected and inbox closed
          isMobile && isMobileInboxOpen ? "hidden" : "" // Hide if mobile inbox is open
      )}>
        <AppHeader 
          userProfile={userProfile} 
          isMobile={isMobile}
          onToggleMobileInbox={() => setIsMobileInboxOpen(!isMobileInboxOpen)}
        />
        <main className="flex-1 overflow-y-auto">
          {selectedInquiry && selectedCustomer ? (
            <InquiryDetailView
              inquiry={selectedInquiry}
              customer={selectedCustomer}
              currentUser={userProfile}
              onBackToList={handleBackToList}
              isMobile={isMobile}
            />
          ) : !isMobile ? ( // Show welcome/empty state only on desktop if no inquiry selected
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <Inbox className="h-16 w-16 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome to SupportPal AI</h2>
              <p className="max-w-md">
                Select an inquiry from the inbox to view details and assist.
              </p>
            </div>
          ) : null /* On mobile, if no inquiry selected, either inbox is open or nothing (blank) if inbox closed */
          }
          {/* Fallback for no inquiries at all */}
          {!isLoadingPage && sortedInquiries.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <AlertTriangle className="h-16 w-16 mb-4 text-destructive" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Inquiries</h2>
                <p className="max-w-md">
                  There are currently no customer inquiries to display.
                </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

    