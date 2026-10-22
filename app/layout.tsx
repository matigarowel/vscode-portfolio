import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

import Layout from '@/components/Layout';

import '@/styles/globals.css';
import '@/styles/themes.css';

export const metadata: Metadata = {
  title: {
    default: 'Rowel Matiga | Portfolio',
    template: 'Rowel Matiga | %s',
  },
  description:
    "Rowel Matiga is an avid full stack web developer building websites and applications you'd love to use",
  keywords: [
    'rowel matiga',
    'matiga',
    'rowel',
    'web developer portfolio',
    'rowel web developer',
    'rowel developer',
    'mern stack',
    'rowel matiga portfolio',
    'vscode-portfolio',
  ],
  openGraph: {
    title: "Rowel Matiga's Portfolio",
    description:
      "A full-stack developer building websites that you'd like to use.",
    images: [''],
    url: 'https://matigabusiness.online,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body style={{ overflow: 'hidden' }}>
        <Layout>{children}</Layout>
        {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
        {clarityProjectId && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",${JSON.stringify(clarityProjectId)});`,
            }}
          />
        )}
      </body>
    </html>
  );
}
