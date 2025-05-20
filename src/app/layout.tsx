
import type {Metadata} from 'next';
// Corrected Geist font imports
import { GeistSans } from 'geist/font/sans'; 
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; 

// We don't need to call GeistSans or GeistMono as functions.
// The imported GeistSans and GeistMono are the font objects themselves,
// and their .variable property provides the necessary CSS class name.

export const metadata: Metadata = {
  title: 'NeoCart', // Updated website title
  description: 'AI-Powered Customer Support Platform & E-commerce Solutions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Default to dark mode for the overall application shell (SupportPal)
    // NeoCart layout will manage its own theme appearance within this.
    <html lang="en" suppressHydrationWarning className="dark">
      {/*
        Apply the .variable class names directly from the imported font objects.
        These classes set up the CSS custom properties (e.g., --font-geist-sans)
        and apply the respective font families.
      */}
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

