import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-inquiry.ts';
import '@/ai/flows/prioritize-inquiries.ts';
import '@/ai/flows/suggest-knowledge-articles.ts';
import '@/ai/flows/generate-agent-response.ts';
