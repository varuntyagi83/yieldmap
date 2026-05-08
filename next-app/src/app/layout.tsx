import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'YieldMap — Real Estate Investment Discovery',
  description: 'Find cash-flow positive investment properties filtered from MLS noise.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className={`${dmSans.className} bg-[#0B0F14] text-[#EEF0F4] antialiased h-full`}>
        {children}
      </body>
    </html>
  );
}
