import './globals.css';
import { ToastProvider } from '@/hooks/useToast';
import Toasts from '@/components/UI/Toasts';
import { Providers } from '@/components/Providers';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ConditionalHeader from '@/components/ConditionalHeader';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Build sophisticated forms with conditional logic, real-time analytics, and seamless user experiences. No code required." />
        <meta name="keywords" content="form builder, surveys, analytics, conditional logic, no-code" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground transition-colors duration-200">
        <ErrorBoundary>
          <Providers>
            <ToastProvider>
              <div className="min-h-screen flex flex-col">
                <ConditionalHeader />
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <Toasts />
            </ToastProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

