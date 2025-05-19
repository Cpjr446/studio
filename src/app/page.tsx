
"use client";

import { useState, useEffect, useMemo } from "react";
import AppSidebarContent from "@/components/layout/app-sidebar-content";
import InquiryDetailView from "@/components/inquiry/inquiry-detail-view";
import AppHeader from "@/components/layout/app-header";
import { mockUserProfile, mockInquiries, mockCustomers } from "@/lib/mock-data";
import type { Inquiry, Customer, NewProductQueryData } from "@/types/support";
import { prioritizeInquiry } from "@/ai/flows/prioritize-inquiries";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Inbox, PanelLeftOpen, X } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile"; 
import { cn } from "@/lib/utils";


export default function SupportPalDashboard() {
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  // Initialize with mockInquiries, and allow adding new ones from localStorage
  const [inquiries, setInquiries] = useState<Inquiry[]>([]); 
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers); // Customers can also be augmented for product queries
  const [userProfile] = useState(mockUserProfile);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const isMobile = useIsMobile();
  const [isMobileInboxOpen, setIsMobileInboxOpen] = useState(false);

  useEffect(() => {
    const processInquiries = async (inqs: Inquiry[]) => {
      const updatedInquiriesPromises = inqs.map(async (inq) => {
        if (inq.priority !== undefined && !inq.isLoadingPriority) return inq; // Already processed or has priority
        try {
          const priority = await prioritizeInquiry({ inquiry: `${inq.subject} ${inq.previewText}` });
          return { ...inq, priority, isLoadingPriority: false };
        } catch (error) {
          console.error(`Failed to prioritize inquiry ${inq.id}:`, error);
          return { ...inq, priority: undefined, isLoadingPriority: false }; 
        }
      });
      return Promise.all(updatedInquiriesPromises);
    };

    const loadAndProcessInquiries = async () => {
      setIsLoadingPage(true);
      let allInquiries: Inquiry[] = mockInquiries.map(inq => ({...inq, isLoadingPriority: true }));
      let updatedCustomers = [...mockCustomers];

      // Load new product queries from localStorage
      const newProductQueriesString = localStorage.getItem('newProductQueries');
      if (newProductQueriesString) {
        const newProductQueryDataItems: NewProductQueryData[] = JSON.parse(newProductQueriesString);
        
        newProductQueryDataItems.forEach(item => {
          // Create a dummy customerId for this inquiry
          const productCustomerId = `prod_user_${item.id.split('_').pop()}`; 
          
          const newInquiry: Inquiry = {
            id: item.id,
            customerId: productCustomerId, // Assign the dummy customer ID
            anonymousUserName: item.submitterName,
            anonymousUserEmail: item.submitterEmail,
            subject: `Product Query: ${item.queryTopic}`,
            previewText: item.message,
            channel: 'product_query',
            status: 'open',
            timestamp: item.timestamp,
            messages: [{
              id: `msg_${item.id}`,
              sender: 'customer',
              content: item.message,
              timestamp: item.timestamp,
            }],
            isLoadingPriority: true,
          };
          allInquiries.push(newInquiry);

          // Optional: Add a transient customer object if needed for display,
          // or rely on anonymousUserName/Email in InquiryListItem
           if (!updatedCustomers.find(c => c.id === productCustomerId)) {
            updatedCustomers.push({
              id: productCustomerId,
              name: item.submitterName,
              email: item.submitterEmail,
              avatarUrl: 'https://placehold.co/80x80.png', // Generic avatar
              joinDate: new Date(item.timestamp).toLocaleDateString(),
              lastContacted: new Date(item.timestamp).toLocaleDateString(),
              tags: ['product_query_submitter'],
            });
          }
        });
        localStorage.removeItem('newProductQueries'); // Clear after processing
      }
      
      const processedInquiries = await processInquiries(allInquiries);
      setInquiries(processedInquiries);
      setCustomers(updatedCustomers); // Update customers state if new ones were added
      setIsLoadingPage(false);

      if (processedInquiries.length > 0) {
        const sorted = [...processedInquiries].sort((a, b) => (b.priority?.priorityScore || 0) - (a.priority?.priorityScore || 0));
        if (!isMobile && sorted.length > 0) {
             setSelectedInquiryId(sorted[0].id);
        }
      }
    };

    loadAndProcessInquiries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
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
      // Fallback sort by timestamp if scores are equal
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [inquiries]);

  const selectedInquiry = inquiries.find(inq => inq.id === selectedInquiryId);
  // Customer lookup will now work for both mock and dynamically added product query customers
  const selectedCustomer = selectedInquiry ? customers.find(cust => cust.id === selectedInquiry.customerId) : undefined;


  const handleSelectInquiry = (id: string) => {
    setSelectedInquiryId(id);
    if (isMobile) {
      setIsMobileInboxOpen(false);
    }
  };

  const handleBackToList = () => { 
    setSelectedInquiryId(null); 
    if (isMobile) {
      setIsMobileInboxOpen(true);
    }
  }

  if (isLoadingPage && inquiries.every(inq => inq.isLoadingPriority !== false)) { // Check if any inquiry is still loading
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
          customers={customers} // Pass the potentially updated customers list
          selectedInquiryId={selectedInquiryId}
          onSelectInquiry={handleSelectInquiry}
        />
      </div>

      <div className={cn(
          "flex-1 flex flex-col h-full overflow-hidden",
          isMobile && selectedInquiryId === null && !isMobileInboxOpen ? "hidden" : "", 
          isMobile && isMobileInboxOpen ? "hidden" : "" 
      )}>
        <AppHeader 
          userProfile={userProfile} 
          isMobile={isMobile}
          onToggleMobileInbox={() => setIsMobileInboxOpen(!isMobileInboxOpen)}
        />
        <main className="flex-1 overflow-y-auto">
          {selectedInquiry ? ( // selectedCustomer could be undefined for product queries initially
            <InquiryDetailView
              inquiry={selectedInquiry}
              // Pass customer if found, otherwise InquiryDetailView should handle it (e.g. display anonymous user name)
              customer={selectedCustomer} 
              currentUser={userProfile}
              onBackToList={handleBackToList}
              isMobile={isMobile}
            />
          ) : !isMobile ? ( 
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <Inbox className="h-16 w-16 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome to SupportPal AI</h2>
              <p className="max-w-md">
                Select an inquiry from the inbox to view details and assist.
              </p>
            </div>
          ) : null 
          }
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
