import './globals.css';

export const metadata = {
  title: 'PandaiKids Build 11',
  description: 'Homepage dengan background bersih tanpa UI bertindan'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
