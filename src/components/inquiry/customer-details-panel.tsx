
"use client";

import type React from "react";
import { UserCircle, Mail, CalendarDays, Tag, Phone, Briefcase, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/support";

interface CustomerDetailsPanelProps {
  customer?: Customer;
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
        <CardHeader>
          <CardTitle className="text-base">Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No customer selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-lg">{customer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
            <CardTitle className="text-md font-semibold">{customer.name}</CardTitle>
            <CardDescription className="text-xs">{customer.email}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <DetailItem icon={Mail} label="Email" value={customer.email} />
        <DetailItem icon={Briefcase} label="Last Contacted" value={customer.lastContacted} />
        {/* 
        <DetailItem icon={CalendarDays} label="Joined Date" value={customer.joinDate} />
        <div className="flex items-start gap-3">
          <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {customer.tags.length > 0 ? (
                customer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs capitalize">{tag}</Badge>
                ))
              ) : (
                <p className="text-sm font-medium">N/A</p>
              )}
            </div>
          </div>
        </div> 
        */}
        <Button variant="outline" size="sm" className="w-full mt-4 text-xs">
          <ExternalLink className="h-3.5 w-3.5 mr-2" />
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsPanel;

    