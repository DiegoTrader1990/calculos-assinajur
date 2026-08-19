import Link from 'next/link';
import { getPopularCalculators } from '@/data/calculators';
import { Coins, FileText, Scale, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Coins,
  FileText,
  Scale,
};

export default function PopularCalculators() {
  const popular = getPopularCalculators();

  return (
    <section id="populares" className="py-16 bg-slate-50 border-t border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
                Mais Buscadas
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Calculadoras Populares
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Ferramentas utilizadas diariamente para simulações financeiras, rescisões e cálculos de correção.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popular.map((calc) => {
            const IconComp = ICON_MAP[calc.icon] || Coins;
            const isAvailable = calc.status === 'active';

            return (
              <div
                key={calc.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-sm">
                      <IconComp className="w-6 h-6" />
                    </div>
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Disponível
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Em breve
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    {calc.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors mt-1 mb-3">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {calc.shortDescription}
                  </p>
                </div>

                {isAvailable ? (
                  <Link
                    href={calc.path}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all bg-sky-600 text-white hover:bg-sky-700 shadow-md shadow-sky-600/20"
                  >
                    Usar Calculadora
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-center bg-slate-100 text-slate-400 cursor-not-allowed">
                    Em desenvolvimento
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
