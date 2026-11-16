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
    'Comprehensive multi-unit enterprise business continuity and disaster recovery planning system modeled for UI Ventures Limited, University of Ibadan (CSC 476 Project).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#09090B] font-sans antialiased selection:bg-[#ECFDF5] selection:text-[#0F3D2E]">
        {children}
      </body>
    </html>
  );
}
