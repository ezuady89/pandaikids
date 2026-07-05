import './globals.css';

export const metadata = {
  title: 'PandaiKids Build 12',
  description: 'Homepage final visual replacement'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
