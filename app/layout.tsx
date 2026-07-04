import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PandaiKids Build 08',
  description: 'Belajar sambil bermain bersama Pandi'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
