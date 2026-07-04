import './globals.css';

export const metadata = {
  title: 'PandaiKids Build 10',
  description: 'Premium homepage fix'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
