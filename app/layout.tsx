import type { Metadata, Viewport } from 'next';
import './globals.css';
import './owner-refinement.css';
import { QuickActions } from '@/components/site/quick-actions';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#11100f',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://overhead-astana-preview.said-amanzhol.chatgpt.site',
  ),
  title: 'OVERHEAD — бар и живая музыка в Астане',
  description:
    'Живые сеты, фирменные коктейли и громкие вечера в OVERHEAD. Астана, Коргалжынское шоссе, 13/1.',
  openGraph: {
    title: 'OVERHEAD — бар и живая музыка в Астане',
    description:
      'Живые сеты, фирменные коктейли и громкие вечера в OVERHEAD. Астана, Коргалжынское шоссе, 13/1.',
    images: [
      {
        url: '/overhead-mark.png',
        width: 1080,
        height: 1080,
        alt: 'OVERHEAD — Астана',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OVERHEAD — бар и живая музыка в Астане',
    description:
      'Живые сеты, фирменные коктейли и громкие вечера в OVERHEAD. Астана, Коргалжынское шоссе, 13/1.',
    images: ['/overhead-mark.png'],
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
    <html lang="ru">
      <body>
        {children}
        <QuickActions />
      </body>
    </html>
  );
}
