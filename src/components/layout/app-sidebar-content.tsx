
"use client";

import type React from "react";
import Link from "next/link";
import { LayoutDashboard, Settings, LifeBuoy, Filter, PlusCircle } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import LogoIcon from "@/components/icons/logo-icon";
import InquiryList from "@/components/inquiry/inquiry-list";
import type { Inquiry, Customer } from "@/types/support";

interface AppSidebarContentProps {
  inquiries: Inquiry[];
  customers: Customer[];
  selectedInquiryId: string | null;
  onSelectInquiry: (id: string) => void;
}

const AppSidebarContent: React.FC<AppSidebarContentProps> = ({ inquiries, customers, selectedInquiryId, onSelectInquiry }) => {
  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-sidebar-foreground">SupportPal AI</h1>
        </div>
        <div className="mt-4 flex gap-2">
            <SidebarInput placeholder="Search inquiries..." className="bg-sidebar-accent border-sidebar-border placeholder:text-sidebar-foreground/60" />
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                <Filter className="h-4 w-4" />
            </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-grow p-0">
        <InquiryList 
            inquiries={inquiries} 
            customers={customers}
            selectedInquiryId={selectedInquiryId}
            onSelectInquiry={onSelectInquiry}
        />
      </SidebarContent>
      
      <SidebarSeparator className="my-0" />
      <SidebarGroup className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="New Inquiry" asChild>
              <Link href="#" className="justify-start">
                <PlusCircle />
                <span>New Inquiry</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dashboard" asChild>
              <Link href="#" className="justify-start">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" asChild>
              <Link href="#" className="justify-start">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help & Support" asChild>
              <Link href="#" className="justify-start">
                <LifeBuoy />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
};

export default AppSidebarContent;
