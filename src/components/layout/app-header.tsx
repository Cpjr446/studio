
"use client";

import type React from "react";
import Link from "next/link";
import { Bell, PlusCircle, PanelLeftOpen as LucidePanelLeftOpen } from "lucide-react"; // Renamed to avoid conflict
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Search input removed for now
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserProfile } from "@/types/support";

interface AppHeaderProps {
  userProfile: UserProfile;
  onToggleMobileInbox?: () => void; 
  isMobile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ userProfile, onToggleMobileInbox, isMobile }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      {isMobile && onToggleMobileInbox && (
         <Button variant="ghost" size="icon" onClick={onToggleMobileInbox} className="md:hidden -ml-2">
           <LucidePanelLeftOpen className="h-5 w-5" /> 
           <span className="sr-only">Toggle Inbox</span>
         </Button>
      )}
      <div className="flex-1">
        {/* Future elements like breadcrumbs or global actions can go here */}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <Link href="/submit-query" passHref>
          <Button variant="outline" size="sm" className="hidden sm:flex"> {/* Hide on very small screens, show on sm+ */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Request
          </Button>
        </Link>
         <Link href="/products/submit-query" passHref>
          <Button variant="default" size="sm"> {/* Changed to default, more prominent */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Product Inquiry
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <Bell className="h-4.5 w-4.5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
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
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
