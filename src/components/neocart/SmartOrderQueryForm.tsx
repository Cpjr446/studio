
"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const queryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(5000),
});

export type SmartOrderQueryFormData = z.infer<typeof queryFormSchema>;

interface SmartOrderQueryFormProps {
  onSubmit: (data: SmartOrderQueryFormData) => Promise<void> | void;
}

export default function SmartOrderQueryForm({ onSubmit }: SmartOrderQueryFormProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SmartOrderQueryFormData>({
    resolver: zodResolver(queryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const handleFormSubmit = async (data: SmartOrderQueryFormData) => {
    await onSubmit(data);
    // Reset form only if onSubmit was successful (implicitly, by not throwing error)
    // The parent component (ContactSection) will handle success/error toasts and potentially hiding the form.
    // If the parent doesn't hide the form, resetting here is good.
    // Let's assume parent might keep form visible on error, so reset is fine.
    reset(); 
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name" className={cn("font-medium text-slate-700", errors.name && "text-red-500")}>Your Name</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input id="name" {...field} placeholder="e.g., Jane Doe" className="mt-1 border-slate-300 focus:border-primary focus:ring-primary" />}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email" className={cn("font-medium text-slate-700", errors.email && "text-red-500")}>Your Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input id="email" type="email" {...field} placeholder="e.g., jane.doe@example.com" className="mt-1 border-slate-300 focus:border-primary focus:ring-primary" />}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="subject" className={cn("font-medium text-slate-700", errors.subject && "text-red-500")}>Subject</Label>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => <Input id="subject" {...field} placeholder="e.g., Question about SmartOrder features" className="mt-1 border-slate-300 focus:border-primary focus:ring-primary" />}
        />
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="message" className={cn("font-medium text-slate-700", errors.message && "text-red-500")}>Message</Label>
        <Controller
          name="message"
          control={control}
          render={({ field }) => <Textarea id="message" {...field} placeholder="Please describe your inquiry in detail..." rows={5} className="mt-1 border-slate-300 focus:border-primary focus:ring-primary"/>}
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 text-base font-semibold" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Send Message'}
      </Button>
    </form>
  );
}

