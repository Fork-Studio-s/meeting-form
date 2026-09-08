import './globals.css';

export const metadata = {
  title: 'Gabeln Studio intro form',
  description: 'A couple of quick questions before we get on a call.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

