import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PandaiKids Build 07',
  description: 'PandaiKids Production UI Build 07 - Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
