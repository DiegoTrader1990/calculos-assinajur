import Link from 'next/link';
import { CALCULATOR_CATEGORIES, CALCULATORS_REGISTRY } from '@/data/calculators';
import { TrendingUp, Briefcase, ShieldCheck, Scale, Home, Building2, ChevronRight } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Scale,
  Home,
  Building2,
};

export default function CategoryGrid() {
  return (
    <section id="categorias" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-2">
            Navegue por Áreas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Categorias de Ferramentas
          </h2>
        </div>
        <p className="text-sm text-slate-500 max-w-md">
          Organizado em categorias intuitivas para você encontrar exatamente o que precisa em poucos cliques.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CALCULATOR_CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || TrendingUp;
          const itemsCount = CALCULATORS_REGISTRY.filter(
            (c) => c.categorySlug === cat.slug
          ).length;

          return (
            <div
              key={cat.slug}
              className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {itemsCount} {itemsCount === 1 ? 'ferramenta' : 'ferramentas'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/#categorias`}
                  className="text-xs font-bold text-sky-600 group-hover:text-sky-700 flex items-center gap-1"
                >
                  Explorar área
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
