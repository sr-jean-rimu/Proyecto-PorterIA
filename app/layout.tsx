import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guía del Conserje | PorterIA',
  description: 'Guía interactiva de uso del sistema de portería de Gran Bretaña.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geist.variable} antialiased`}>{children}</body></html>;
}
