
"use client";

import type React from "react";
import Link from 'next/link'; // Import Link
import { Filter, Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LogoIcon from "@/components/icons/logo-icon";
import InquiryList from "@/components/inquiry/inquiry-list";
import type { Inquiry, Customer } from "@/types/support";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppSidebarContentProps {
  inquiries: Inquiry[];
  customers: Customer[];
  selectedInquiryId: string | null;
  onSelectInquiry: (id: string) => void;
}

const AppSidebarContent: React.FC<AppSidebarContentProps> = ({ inquiries, customers, selectedInquiryId, onSelectInquiry }) => {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <header className="p-4 md:p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <LogoIcon className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold">Inbox</h1>
        </div>
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search inquiries..." className="pl-8 h-9 bg-background" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Inquiries</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="assigned_to_me">Assigned to me</SelectItem>
            <SelectItem value="urgent">Urgent First</SelectItem>
            <SelectItem value="new_replied">New/Replied</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <ScrollArea className="flex-1">
        <InquiryList 
            inquiries={inquiries} 
            customers={customers}
            selectedInquiryId={selectedInquiryId}
            onSelectInquiry={onSelectInquiry}
        />
      </ScrollArea>
      
      <footer className="p-4 border-t border-sidebar-border text-sm">
        <Link href="/neocart/smartorder" passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit NeoCart Site
          </a>
        </Link>
        <p className="text-xs text-muted-foreground text-center mt-2">&copy; {new Date().getFullYear()} SupportPal AI</p>
      </footer>
    </div>
  );
};

export default AppSidebarContent;
