
"use client";

import type React from "react";
import { Mail, ExternalLink } from "lucide-react"; // Simplified imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge"; // Not used in simplified version
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/support";

interface CustomerDetailsPanelProps {
  customer?: Customer; // Customer can be undefined
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "N/A"}</p>
    </div>
  </div>
);

const CustomerDetailsPanel: React.FC<CustomerDetailsPanelProps> = ({ customer }) => {
  if (!customer) {
    return (
      <Card className="h-full bg-card shadow-none border-none">
        <CardHeader className="pb-3 pt-3 px-3">
          <CardTitle className="text-sm font-medium">Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <p className="text-xs text-muted-foreground">No customer details available for this inquiry type.</p>
        </CardContent>
      </Card>
    );
  }

  const displayName = customer.name || "N/A";
  const displayEmail = customer.email || "N/A";
  const avatarFallback = displayName.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase() || "U";

  return (
    <Card className="shadow-none border bg-background">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
            <AvatarImage src={customer.avatarUrl} alt={displayName} data-ai-hint="person portrait" />
            <AvatarFallback className="text-base">{avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
            <CardTitle className="text-sm font-medium">{displayName}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">{displayEmail}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 text-sm px-3 pb-3">
        <DetailItem icon={Mail} label="Email" value={displayEmail} />
        {customer.lastContacted && <DetailItem icon={Mail} label="Last Contacted" value={customer.lastContacted} />} 
        {/* Removed Join Date and Tags for simplification as per prompt */}
        <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
          <ExternalLink className="h-3.5 w-3.5 mr-2" />
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsPanel;
