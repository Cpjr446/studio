
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SmartOrderQueryFormData>({
    resolver: zodResolver(queryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const handleFormSubmit = async (data: SmartOrderQueryFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 md:space-y-8">
      <div>
        <Label htmlFor="name" className={cn("block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1", errors.name && "text-red-600 dark:text-red-400")}>
          Your Name
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g., Jane Doe"
          className="mt-1 w-full border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50 py-2.5 px-3.5 text-base bg-primary/10 text-slate-800 placeholder:text-primary/60 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
        {errors.name && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email" className={cn("block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1", errors.email && "text-red-600 dark:text-red-400")}>
          Your Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="e.g., jane.doe@example.com"
          className="mt-1 w-full border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50 py-2.5 px-3.5 text-base bg-primary/10 text-slate-800 placeholder:text-primary/60 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
        {errors.email && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors.email.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="subject" className={cn("block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1", errors.subject && "text-red-600 dark:text-red-400")}>
          Subject
        </Label>
        <Input
          id="subject"
          {...register("subject")}
          placeholder="e.g., Question about SmartOrder features"
          className="mt-1 w-full border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50 py-2.5 px-3.5 text-base bg-primary/10 text-slate-800 placeholder:text-primary/60 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
        {errors.subject && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="message" className={cn("block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1", errors.message && "text-red-600 dark:text-red-400")}>
          Message
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Please describe your inquiry in detail..."
          rows={5}
          className="mt-1 w-full border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50 py-2.5 px-3.5 text-base bg-primary/10 text-slate-800 placeholder:text-primary/60 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
        {errors.message && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors.message.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground py-3 px-6 text-base font-semibold rounded-lg shadow-md transition-colors duration-300 ease-in-out disabled:opacity-70" 
        disabled={isSubmitting}
      >
        <Send className="h-5 w-5" />
        {isSubmitting ? 'Submitting...' : 'Send Your Message'}
      </Button>
    </form>
  );
}
