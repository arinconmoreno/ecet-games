import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'E-CET Games | Sofka',
  description: 'Torneo de integración del equipo CET - Sofka',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-radial-glow antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
