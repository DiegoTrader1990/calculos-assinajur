import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://calculos.assinajur.com.br'),
  title: {
    default: 'Cálculos por AssinaJur — Ferramentas e Simuladores Gratuitos',
    template: '%s | Cálculos por AssinaJur',
  },
  description:
    'Portal público de calculadoras simples, gratuitas e precisas para finanças, trabalho, previdência, jurídico, imóveis e empresas.',
  keywords: [
    'calculadora',
    'juros compostos',
    'rescisão trabalhista',
    'atualização monetária',
    'simulador financeiro',
    'cálculo de rescisão',
    'assinajur',
    'inss',
    'financiamento'
  ],
  authors: [{ name: 'AssinaJur' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Cálculos por AssinaJur',
    description: 'Portal público de calculadoras simples, gratuitas e precisas para finanças, trabalho, previdência, jurídico e empresas.',
    url: 'https://calculos.assinajur.com.br',
    siteName: 'Cálculos por AssinaJur',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={plusJakarta.variable}>
      <body className="font-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
