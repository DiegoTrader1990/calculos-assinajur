import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import AllCalculatorsView from '@/components/AllCalculatorsView';

export const metadata: Metadata = {
  title: 'Todas as Calculadoras e Simuladores Gratuitos',
  description: 'Lista completa de calculadoras financeiras, rescisões trabalhistas, atualização monetária judicial, simuladores de aposentadoria e imobiliários.',
  alternates: {
    canonical: 'https://calculos.assinajur.com.br/calculadoras',
  },
};

export default function AllCalculatorsPage() {
  const breadcrumbs = [
    { label: 'Calculadoras' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-3 py-1 rounded-md mb-3 inline-block">
            Acervo Completo
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Todas as Calculadoras
          </h1>
          <p className="text-slate-600 text-base max-w-2xl leading-relaxed">
            Explore nossa lista completa de simuladores organizados por áreas de atuação. Respostas rápidas e sem necessidade de cadastro.
          </p>
        </div>

        <AllCalculatorsView />

      </div>
    </div>
  );
}
