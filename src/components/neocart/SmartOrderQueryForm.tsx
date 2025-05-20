
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
import { Send } from 'lucide-react';

const queryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100, { message: "Name must be 100 characters or less."}),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }).max(150, { message: "Subject must be 150 characters or less."}),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(5000, { message: "Message must be 5000 characters or less."}),
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
    // The parent component (ContactSection) will handle success/error toasts.
    reset(); 
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 md:space-y-8">
      <div>
        <Label htmlFor="name" className={cn("block text-sm font-medium text-slate-700 mb-1", errors.name && "text-red-600")}>Your Name</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input id="name" {...field} placeholder="e.g., Jane Doe" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50 py-2.5 px-3.5 text-base" />}
        />
        {errors.name && <p className="text-xs text-red-600 mt-1.5">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email" className={cn("block text-sm font-medium text-slate-700 mb-1", errors.email && "text-red-600")}>Your Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input id="email" type="email" {...field} placeholder="e.g., jane.doe@example.com" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50 py-2.5 px-3.5 text-base" />}
        />
        {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="subject" className={cn("block text-sm font-medium text-slate-700 mb-1", errors.subject && "text-red-600")}>Subject</Label>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => <Input id="subject" {...field} placeholder="e.g., Question about SmartOrder features" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50 py-2.5 px-3.5 text-base" />}
        />
        {errors.subject && <p className="text-xs text-red-600 mt-1.5">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="message" className={cn("block text-sm font-medium text-slate-700 mb-1", errors.message && "text-red-600")}>Message</Label>
        <Controller
          name="message"
          control={control}
          render={({ field }) => <Textarea id="message" {...field} placeholder="Please describe your inquiry in detail..." rows={5} className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50 py-2.5 px-3.5 text-base"/>}
        />
        {errors.message && <p className="text-xs text-red-600 mt-1.5">{errors.message.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 text-base font-semibold rounded-lg shadow-md transition-colors duration-300 ease-in-out disabled:opacity-70" 
        disabled={isSubmitting}
      >
        <Send className="h-5 w-5" />
        {isSubmitting ? 'Submitting...' : 'Send Your Message'}
      </Button>
    </form>
  );
}
