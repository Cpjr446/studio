
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebase'; // Ensure firebase is initialized and db is exported
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const queryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type SmartOrderQueryFormData = z.infer<typeof queryFormSchema>;

interface ActionResult {
    success: boolean;
    error?: string;
    data?: any;
}

export async function submitUserQuery(formData: SmartOrderQueryFormData): Promise<ActionResult> {
  const validation = queryFormSchema.safeParse(formData);

  if (!validation.success) {
    // Simplified error reporting for this example
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const docRef = await addDoc(collection(db, "userQueries"), {
      ...validation.data,
      timestamp: serverTimestamp(), // Adds a server-side timestamp
      status: "new", // Default status for new queries
    });
    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    if (error instanceof Error) {
        return { success: false, error: `Failed to submit query: ${error.message}` };
    }
    return { success: false, error: "Failed to submit query due to an unexpected error." };
  }
}
