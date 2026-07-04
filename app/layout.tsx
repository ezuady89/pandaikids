import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PandaiKids Build 09',
  description: 'PandaiKids Premium Homepage'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
