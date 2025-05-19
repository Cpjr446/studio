
"use client";

import type React from "react";
// import Link from "next/link"; // Link is not used after removing menu items
import { Filter } from "lucide-react"; // Removed unused icons: LayoutDashboard, Settings, LifeBuoy, PlusCircle
import {
  SidebarContent,
  SidebarGroup,
  // SidebarGroupLabel, // Not used after removing menu items
  SidebarHeader,
  SidebarInput,
  // SidebarMenu, // Not used after removing menu items
  // SidebarMenuButton, // Not used after removing menu items
  // SidebarMenuItem, // Not used after removing menu items
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
      <SidebarHeader className="p-4 md:p-6"> {/* Increased padding */}
        <div className="flex items-center gap-3"> {/* Increased gap */}
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-sidebar-foreground">SupportPal AI</h1>
        </div>
        <div className="mt-6 flex gap-2"> {/* Increased mt */}
            <SidebarInput placeholder="Search inquiries..." className="bg-sidebar-accent border-sidebar-border placeholder:text-sidebar-foreground/60" />
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                <Filter className="h-5 w-5" /> {/* Slightly larger icon */}
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
      
      {/* Removed non-functional menu items and their container */}
      <SidebarSeparator className="my-0" />
      <SidebarGroup className="p-4"> {/* Increased padding for any potential future footer items */}
        {/* <SidebarMenu>
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
        </SidebarMenu> */}
        <div className="text-xs text-sidebar-foreground/60 text-center">
          {/* Placeholder for future sidebar footer content, like version or quick actions */}
        </div>
      </SidebarGroup>
    </>
  );
};

export default AppSidebarContent;
