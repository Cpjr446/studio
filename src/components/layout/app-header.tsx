
"use client";

import type React from "react";
import Link from "next/link";
import { Bell, PanelLeftOpen as LucidePanelLeftOpen, LogOut, Settings, UserCircle,Zap, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserProfile } from "@/types/support";
import { useToast } from "@/hooks/use-toast"; // Added useToast

interface AppHeaderProps {
  userProfile: UserProfile;
  onToggleMobileInbox?: () => void; 
  isMobile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ userProfile, onToggleMobileInbox, isMobile }) => {
  const { toast } = useToast(); // Initialize useToast

  const handleFeatureNotImplemented = (featureName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${featureName} feature is not yet implemented.`,
      variant: "default", 
    });
  };

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
        {/* NeoCart link removed as per separate instruction for agent interface */}
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
            <DropdownMenuItem onClick={() => handleFeatureNotImplemented('Profile')}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureNotImplemented('Settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureNotImplemented('Keyboard Shortcuts')}>
              <Zap className="mr-2 h-4 w-4" /> {/* Using Zap as a placeholder for keyboard icon */}
              <span>Keyboard Shortcuts</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureNotImplemented('Help & Support')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFeatureNotImplemented('Logout')}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
