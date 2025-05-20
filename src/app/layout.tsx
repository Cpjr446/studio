
import type {Metadata} from 'next';
// Corrected Geist font imports
import { GeistSans } from 'geist/font/sans'; 
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; 

const geistSans = GeistSans({ 
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({ 
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SupportPal AI',
  description: 'AI-Powered Customer Support Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Default to dark mode
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
