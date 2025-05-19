
// src/components/query/submit-query-form.tsx
"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const queryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  queryTopic: z.string().min(1, { message: "Please select a query topic." }),
  urgencyLevel: z.enum(['Low', 'Medium', 'High'], { errorMap: () => ({ message: "Please select an urgency level."}) }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(5000),
});

type QueryFormData = z.infer<typeof queryFormSchema>;

interface SubmitQueryFormProps {
  onSubmit: (data: QueryFormData) => void;
}

const SubmitQueryForm: React.FC<SubmitQueryFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<QueryFormData>({
    resolver: zodResolver(queryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      queryTopic: '',
      urgencyLevel: undefined, // So placeholder shows
      message: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name" className={cn(errors.name && "text-destructive")}>Your Name</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input id="name" {...field} placeholder="e.g., Jane Doe" className="mt-1 bg-input"/>}
        />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>Your Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input id="email" type="email" {...field} placeholder="e.g., jane.doe@example.com" className="mt-1 bg-input"/>}
        />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="queryTopic" className={cn(errors.queryTopic && "text-destructive")}>Query Topic</Label>
        <Controller
          name="queryTopic"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="queryTopic" className="mt-1 bg-input">
                <SelectValue placeholder="Select a topic..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billing">Billing Issue</SelectItem>
                <SelectItem value="technical_support">Technical Support</SelectItem>
                <SelectItem value="product_feedback">Product Feedback</SelectItem>
                <SelectItem value="account_access">Account Access</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.queryTopic && <p className="text-xs text-destructive mt-1">{errors.queryTopic.message}</p>}
      </div>

      <div>
        <Label htmlFor="urgencyLevel" className={cn(errors.urgencyLevel && "text-destructive")}>Urgency Level</Label>
        <Controller
          name="urgencyLevel"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="urgencyLevel" className="mt-1 bg-input">
                <SelectValue placeholder="Select urgency..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low - Not time sensitive</SelectItem>
                <SelectItem value="Medium">Medium - Affecting my work</SelectItem>
                <SelectItem value="High">High - Urgent, blocking issue</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.urgencyLevel && <p className="text-xs text-destructive mt-1">{errors.urgencyLevel.message}</p>}
      </div>

      <div>
        <Label htmlFor="message" className={cn(errors.message && "text-destructive")}>Message</Label>
        <Controller
          name="message"
          control={control}
          render={({ field }) => <Textarea id="message" {...field} placeholder="Please describe your issue in detail..." rows={6} className="mt-1 bg-input"/>}
        />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Query'}
      </Button>
    </form>
  );
};

export default SubmitQueryForm;

    