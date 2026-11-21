import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UI Ventures Limited | Multi-Unit Disaster Recovery Planning System (DRPS)',
  description:
    'Enterprise disaster recovery planning and operational continuity management platform for UI Ventures Limited subsidiaries, University of Ibadan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F3F4F6] text-[#111827] font-sans antialiased selection:bg-[#DCFCE7] selection:text-[#0A261D]">
        {children}
      </body>
    </html>
  );
}
