'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Coins, Briefcase, ShieldCheck, Scale, Home, Building2, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { CALCULATOR_CATEGORIES, searchCalculators } from '@/data/calculators';

const ICON_MAP: Record<string, any> = {
  Coins,
  Briefcase,
  ShieldCheck,
  Scale,
  Home,
  Building2,
};

export default function AllCalculatorsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCalculators = searchCalculators(searchTerm, selectedCategory);

  return (
    <div className="space-y-8">
      
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome ou palavra-chave..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas
          </button>
          {CALCULATOR_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of All Calculators */}
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => {
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
                        <CheckCircle2 className="w-3 h-3" />
                        Disponível
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Em breve
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    {calc.category}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mt-0.5 mb-2">
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
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">
            Nenhuma calculadora encontrada para os filtros selecionados.
          </p>
        </div>
      )}

    </div>
  );
}
