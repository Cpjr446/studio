
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
  customerId: string; // For product queries, this might be a generated ID not in mockCustomers
  subject: string;
  previewText: string;
  channel: 'email' | 'chat' | 'phone' | 'product_query'; // Added 'product_query'
  status: 'open' | 'pending' | 'resolved' | 'closed';
  timestamp: string;
  messages: Message[];
  priority?: PrioritizeInquiryOutput;
  isLoadingPriority?: boolean;
  // Fields for queries submitted without a pre-existing customer record
  anonymousUserName?: string;
  anonymousUserEmail?: string;
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

// Interface for data stored in localStorage for new product queries
export interface NewProductQueryData {
  id: string; // Unique ID for the query itself
  timestamp: string;
  submitterName: string;
  submitterEmail: string;
  queryTopic: string;
  urgencyLevel: 'Low' | 'Medium' | 'High';
  message: string;
}
