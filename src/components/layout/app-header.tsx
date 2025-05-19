
"use client";

import type React from "react";
import Link from "next/link";
import { Bell, Search, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// SidebarTrigger might not be needed if we are not using the old sidebar system for mobile
// import { SidebarTrigger } from "@/components/ui/sidebar";
import type { UserProfile } from "@/types/support";

interface AppHeaderProps {
  userProfile: UserProfile;
  onToggleMobileInbox?: () => void; // For mobile view to toggle inbox
  isMobile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ userProfile, onToggleMobileInbox, isMobile }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      {isMobile && onToggleMobileInbox && (
         <Button variant="ghost" size="icon" onClick={onToggleMobileInbox} className="md:hidden">
           <PanelLeftOpen className="h-5 w-5" /> {/* Placeholder, replace with actual icon */}
           <span className="sr-only">Toggle Inbox</span>
         </Button>
      )}
      <div className="flex-1">
        {/* Search or other elements can go here if needed in the future */}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/submit-query" passHref>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit a Request
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="profile person" />
                <AvatarFallback>
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

// Placeholder icon, replace with actual lucide-react icon if available or an SVG
const PanelLeftOpen: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
);


export default AppHeader;

    