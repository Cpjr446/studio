
import type { Customer, Inquiry, KnowledgeArticle, QuickResponse, UserProfile } from '@/types/support';

export const mockUserProfile: UserProfile = {
  name: 'Alex Green',
  avatarUrl: 'https://placehold.co/100x100.png',
  email: 'alex.green@supportpal.ai',
};

export const mockCustomers: Customer[] = [
  {
    id: 'cust_001',
    name: 'Alice Wonderland',
    email: 'alice.w@example.com',
    avatarUrl: 'https://placehold.co/80x80.png',
    joinDate: '2023-01-15',
    lastContacted: '2024-07-20',
    tags: ['premium', 'active'],
  },
  {
    id: 'cust_002',
    name: 'Bob The Builder',
    email: 'bob.b@example.com',
    avatarUrl: 'https://placehold.co/80x80.png',
    joinDate: '2022-11-01',
    lastContacted: '2024-07-18',
    tags: ['new', 'feedback_provided'],
  },
  {
    id: 'cust_003',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    avatarUrl: 'https://placehold.co/80x80.png',
    joinDate: '2023-05-10',
    lastContacted: '2024-06-25',
    tags: ['churn_risk'],
  },
];

export const mockInquiries: Inquiry[] = [
  {
    id: 'inq_001',
    customerId: 'cust_001',
    subject: 'Issue with my recent order #12345',
    previewText: "Hi, I'm having trouble with the tracking for my recent order. Can you help?",
    channel: 'email',
    status: 'open',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    messages: [
      { id: 'msg_001a', sender: 'customer', content: "Hi, I'm having trouble with the tracking for my recent order #12345. The website says it's shipped but the tracking number doesn't work.", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString() },
      { id: 'msg_001b', sender: 'agent', content: "Hello Alice, I'm sorry to hear you're having trouble. Let me check that for you. Can you confirm the tracking number?", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'inq_002',
    customerId: 'cust_002',
    subject: 'Billing question - incorrect charge',
    previewText: 'I think I was overcharged on my last bill. The amount is higher than expected.',
    channel: 'chat',
    status: 'open',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    messages: [
      { id: 'msg_002a', sender: 'customer', content: 'I think I was overcharged on my last bill. The amount is $50 but it should be $30.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'inq_003',
    customerId: 'cust_003',
    subject: 'Feature request: Dark mode',
    previewText: 'It would be great if your app had a dark mode. My eyes would thank you!',
    channel: 'email',
    status: 'pending',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    messages: [
      { id: 'msg_003a', sender: 'customer', content: 'It would be great if your app had a dark mode. My eyes would thank you!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { id: 'msg_003b', sender: 'agent', content: "Thanks for the suggestion, Charlie! We'll pass this on to our product team.", timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'inq_004',
    customerId: 'cust_001',
    subject: 'How to reset password?',
    previewText: "I've forgotten my password and can't seem to find the reset link.",
    channel: 'chat',
    status: 'resolved',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    messages: [
      { id: 'msg_004a', sender: 'customer', content: "I've forgotten my password and can't seem to find the reset link.", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'msg_004b', sender: 'agent', content: "Hi Alice, you can reset your password by visiting example.com/reset-password. Let me know if that works!", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString() },
      { id: 'msg_004c', sender: 'customer', content: "Perfect, that worked! Thanks.", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString() },
    ],
  },
];

export const mockKnowledgeArticles: KnowledgeArticle[] = [
  { id: 'ka_001', title: 'How to Track Your Order', url: '#', summary: 'Learn how to find your tracking number and check your order status.' },
  { id: 'ka_002', title: 'Understanding Your Bill', url: '#', summary: 'A guide to reading your monthly statement and common charges.' },
  { id: 'ka_003', title: 'Resetting Your Password', url: '#', summary: 'Step-by-step instructions for resetting your account password.' },
  { id: 'ka_004', title: 'Managing Account Settings', url: '#', summary: 'Update your profile, notification preferences, and more.' },
];

export const mockQuickResponses: QuickResponse[] = [
  { id: 'qr_001', title: 'Greeting & Intro', content: 'Hello! Thanks for contacting SupportPal. How can I help you today?' },
  { id: 'qr_002', title: 'Password Reset Info', content: 'You can reset your password by visiting [YourApp.com/reset]. Let me know if you need further assistance!' },
  { id: 'qr_003', title: 'Order Tracking Info', content: 'To track your order, please visit [YourApp.com/tracking] and enter your order number. It may take up to 24 hours for tracking information to update.' },
  { id: 'qr_004', title: 'Escalation', content: "I understand this is frustrating. Let me escalate this to my supervisor who can better assist you. Please hold on a moment." },
];
