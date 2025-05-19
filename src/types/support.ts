
import type { PrioritizeInquiryOutput } from '@/ai/flows/prioritize-inquiries';

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinDate: string;
  lastContacted: string;
  tags: string[];
}

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  content: string;
  timestamp: string;
  avatar?: string; // Optional: if agent/customer has specific avatar for message
}

export interface Inquiry {
  id: string;
  customerId: string;
  subject: string;
  previewText: string;
  channel: 'email' | 'chat' | 'phone';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  timestamp: string;
  messages: Message[];
  priority?: PrioritizeInquiryOutput;
  isLoadingPriority?: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  url: string;
  summary?: string;
}

export interface QuickResponse {
  id: string;
  title: string;
  content: string;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  email: string;
}
