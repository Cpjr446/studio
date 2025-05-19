
"use client";

// This component is largely superseded by the layout in src/app/page.tsx
// It can be removed or refactored if no longer needed.
// For now, keeping it simple as it might not be used in the new layout.

import type React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
  // Props below are likely unused with the new page.tsx structure
  // userProfile: UserProfile;
  // inquiries: Inquiry[];
  // customers: Customer[];
  // selectedInquiryId: string | null;
  // onSelectInquiry: (id: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children,
}) => {
  // The SidebarProvider and Sidebar structure from the old layout
  // is not directly applicable to the new 30/70 split managed in page.tsx.
  // This component might just become a simple wrapper if used at all.
  return (
    <div className="flex flex-col min-h-screen">
      {/* AppHeader is now likely rendered within the right panel in page.tsx */}
      {/* <AppHeader userProfile={userProfile} /> */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

    