import SearchHero from '@/components/SearchHero';
import CategoryGrid from '@/components/CategoryGrid';
import PopularCalculators from '@/components/PopularCalculators';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Search Hero Section */}
      <SearchHero />

      {/* Popular Calculators */}
      <PopularCalculators />

      {/* Categories Section */}
      <CategoryGrid />

      {/* Value Pillars Section */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-2">
              Por que usar o Cálculos AssinaJur?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Desenvolvido para Máxima Simplicidade e Confiança
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Resultado Instantâneo</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Sem cadastros obrigatórios, formulários infinitos ou espera. Preencha os dados e veja o resultado imediatamente.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Fórmulas Atualizadas</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Cálculos baseados em legislação e matemática financeira oficial, atualizados constantemente.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Privacidade Total</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Os valores inseridos são processados diretamente na memória do seu navegador. Nenhum dado é armazenado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="py-12 bg-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-1">
              Pronto para simular seus investimentos?
            </h3>
            <p className="text-sky-100 text-sm">
              Acesse a Calculadora de Juros Compostos com aportes mensais e tabela detalhada.
            </p>
          </div>
          <Link
            href="/financeiro/juros-compostos"
            className="px-6 py-3 rounded-xl bg-white text-sky-700 font-bold text-sm hover:bg-sky-50 transition-colors flex items-center gap-2 shadow-md flex-shrink-0"
          >
            Calcular Juros Compostos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
