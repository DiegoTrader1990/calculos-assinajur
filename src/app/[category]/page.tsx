import { Metadata } from 'next';
import { CALCULATOR_CATEGORIES, getCalculatorsByCategory } from '@/data/calculators';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Coins, FileText, Scale, ArrowRight, CheckCircle2, Clock, ShieldCheck, Home, Building2 } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Coins,
  FileText,
  Scale,
  ShieldCheck,
  Home,
  Building2,
};

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = CALCULATOR_CATEGORIES.find(c => c.slug.toLowerCase() === params.category.toLowerCase());
  if (!cat) {
    return { title: 'Categoria Não Encontrada' };
  }

  return {
    title: `Calculadoras de ${cat.name} — Ferramentas Gratuitas`,
    description: cat.description,
    alternates: {
      canonical: `https://calculos.assinajur.com.br/${cat.slug}`,
    },
    openGraph: {
      title: `Calculadoras de ${cat.name} | Cálculos por AssinaJur`,
      description: cat.description,
      url: `https://calculos.assinajur.com.br/${cat.slug}`,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const cat = CALCULATOR_CATEGORIES.find(c => c.slug.toLowerCase() === params.category.toLowerCase());
  
  if (!cat) {
    notFound();
  }

  const calculators = getCalculatorsByCategory(cat.slug);

  const breadcrumbs = [
    { label: 'Categorias', href: '/#categorias' },
    { label: cat.name },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-3 py-1 rounded-md mb-3 inline-block">
            Área {cat.name}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Calculadoras de {cat.name}
          </h1>
          <p className="text-slate-600 text-base max-w-2xl leading-relaxed">
            {cat.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {calculators.map((calc) => {
            const IconComp = ICON_MAP[calc.icon] || Coins;
            const isAvailable = calc.status === 'active';

            return (
              <div
                key={calc.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Disponível
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Em breve
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {calc.name}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {calc.shortDescription}
                  </p>
                </div>

                {isAvailable ? (
                  <Link
                    href={calc.path}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all bg-sky-600 text-white hover:bg-sky-700 shadow-sm"
                  >
                    Usar Calculadora
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-center bg-slate-100 text-slate-400 cursor-not-allowed">
                    Em breve
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
