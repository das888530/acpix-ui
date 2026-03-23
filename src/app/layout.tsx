import type {Metadata} from 'next';
import './globals.css';
import { AuthHydrator } from "@/components/auth/AuthHydrator";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: 'StreamVault | Cinematic OTT Experience',
  description: 'Your premium destination for high-quality streaming content.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthHydrator user={currentUser} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
