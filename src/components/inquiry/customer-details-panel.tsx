
"use client";

import type React from "react";
import { UserCircle, Mail, CalendarDays, Tag, Phone, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/types/support";

interface CustomerDetailsPanelProps {
  customer?: Customer;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "N/A"}</p>
    </div>
  </div>
);

const CustomerDetailsPanel: React.FC<CustomerDetailsPanelProps> = ({ customer }) => {
  if (!customer) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No customer selected or information unavailable.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person portrait" />
          <AvatarFallback className="text-2xl">{customer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{customer.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <DetailItem icon={Mail} label="Email" value={customer.email} />
        <DetailItem icon={CalendarDays} label="Joined Date" value={customer.joinDate} />
        <DetailItem icon={Briefcase} label="Last Contacted" value={customer.lastContacted} />
        
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

        {/* Add more details as needed */}
        {/* <DetailItem icon={Phone} label="Phone Number" value={customer.phone || "N/A"} /> */}
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsPanel;
