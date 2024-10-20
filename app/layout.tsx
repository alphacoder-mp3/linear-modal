import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // Regular and Bold weights
  variable: '--font-poppins', // Custom CSS variable
});

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Linear modal',
  description: 'Generated with NEXT JS',
  keywords: ['Linear modal', 'linear', 'Next js'],
  authors: [{ name: 'Akshay Shinde' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        {children}
        <Toaster />
        <TailwindIndicator />
      </body>
    </html>
  );
}
