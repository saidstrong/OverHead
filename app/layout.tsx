import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://overhead-astana-preview.said-amanzhol.chatgpt.site',
  ),
  title: 'Overhead — Live Music Bar in Astana',
  description:
    'Live music, loud nights and cold drinks at Overhead Club in Astana.',
  openGraph: {
    title: 'Overhead — Live Music Bar in Astana',
    description:
      'Live music, loud nights and cold drinks at Overhead Club in Astana.',
    images: [
      {
        url: '/og.png',
        width: 1731,
        height: 909,
        alt: 'Overhead Live Music Bar Astana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Overhead — Live Music Bar in Astana',
    description:
      'Live music, loud nights and cold drinks at Overhead Club in Astana.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
