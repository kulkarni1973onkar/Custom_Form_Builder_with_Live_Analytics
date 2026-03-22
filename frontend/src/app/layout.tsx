import './globals.css';
import { ToastProvider } from '@/hooks/useToast';
import Toasts from '@/components/UI/Toasts';
import { Providers } from '@/components/Providers';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground transition-colors duration-200">
        <Providers>
          <ToastProvider>
            {children}
            <Toasts />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}

