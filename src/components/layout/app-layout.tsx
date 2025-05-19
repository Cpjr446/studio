"use client";

import type React from "react";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import AppHeader from "./app-header";
import AppSidebarContent from "./app-sidebar-content";
import type { Inquiry, Customer, UserProfile } from "@/types/support";

interface AppLayoutProps {
  children: React.ReactNode;
  userProfile: UserProfile;
  inquiries: Inquiry[];
  customers: Customer[];
  selectedInquiryId: string | null;
  onSelectInquiry: (id: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  userProfile,
  inquiries,
  customers,
  selectedInquiryId,
  onSelectInquiry
}) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
        <AppSidebarContent 
          inquiries={inquiries} 
          customers={customers}
          selectedInquiryId={selectedInquiryId}
          onSelectInquiry={onSelectInquiry}
        />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-background">
        <AppHeader userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;