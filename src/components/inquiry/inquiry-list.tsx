
"use client";

import type React from "react";
import type { Inquiry, Customer } from "@/types/support";
import InquiryListItem from "./inquiry-list-item";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InquiryListProps {
  inquiries: Inquiry[];
  customers: Customer[];
  selectedInquiryId: string | null;
  onSelectInquiry: (id: string) => void;
}

const InquiryList: React.FC<InquiryListProps> = ({ inquiries, customers, selectedInquiryId, onSelectInquiry }) => {
  
  const getCustomerById = (id: string) => customers.find(c => c.id === id);

  if (!inquiries.length) {
    return <div className="p-4 text-center text-sm text-sidebar-foreground/70">No inquiries found.</div>;
  }
  
  return (
    <ScrollArea className="h-full">
      <div className="p-3 md:p-4 space-y-2"> {/* Increased padding and space-y */}
        {inquiries.map((inquiry) => (
          <InquiryListItem
            key={inquiry.id}
            inquiry={inquiry}
            customer={getCustomerById(inquiry.customerId)}
            isSelected={inquiry.id === selectedInquiryId}
            onSelect={onSelectInquiry}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default InquiryList;
