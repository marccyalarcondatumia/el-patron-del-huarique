import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'El Patrón del Huarique | Delivery en Huacho',
  description: 'Hamburguesas, alitas y antojos de madrugada. Delivery todos los días en Huacho hasta las 3 a. m.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
