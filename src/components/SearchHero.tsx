'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight, Coins, Briefcase, ShieldCheck, Scale, Home, Building2, CheckCircle2, Clock } from 'lucide-react';
import { CALCULATOR_CATEGORIES, searchCalculators } from '@/data/calculators';

const ICON_MAP: Record<string, any> = {
  Coins,
  Briefcase,
  ShieldCheck,
  Scale,
  Home,
  Building2,
};

export default function SearchHero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCalculators = searchCalculators(searchTerm, selectedCategory);

  return (
    <section className="relative pt-10 pb-14 bg-gradient-to-b from-sky-50/60 via-white to-slate-50 border-b border-slate-200/60 overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-100/80 text-sky-800 border border-sky-200/60 mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Ferramentas de precisão para pessoas e profissionais</span>
        </div>

        {/* H1 Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
          O que você precisa <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700">calcular?</span>
        </h1>

        {/* Subtitle explicitly encompassing all 6 domains */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Simuladores e calculadoras para <strong>finanças</strong>, <strong>trabalho</strong>, <strong>previdência</strong>, <strong>jurídico</strong>, <strong>imóveis</strong> e <strong>empresas</strong>. Respostas rápidas e confiáveis em poucos segundos.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o que deseja calcular (ex: demissão, juros, aposentar, IPCA-E)..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium text-base shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              aria-label="Buscar calculadora por nome, termo ou palavra-chave"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todas as Áreas
          </button>
          {CALCULATOR_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dynamic Search Results Box */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="text-left bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Resultados da busca ({filteredCalculators.length})
              </h2>
              {searchTerm && (
                <span className="text-xs text-slate-500">
                  Termo: <strong>&quot;{searchTerm}&quot;</strong>
                </span>
              )}
            </div>
            {filteredCalculators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCalculators.map((calc) => {
                  const IconComp = ICON_MAP[calc.icon] || Coins;
                  const isAvailable = calc.status === 'active';

                  return (
                    <div
                      key={calc.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-sky-50/50 hover:border-sky-300 transition-all flex items-start gap-3.5 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100/60 px-2 py-0.5 rounded">
                            {calc.category}
                          </span>
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Disponível
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3" /> Em breve
                            </span>
                          )}
                        </div>
                        
                        {isAvailable ? (
                          <Link href={calc.path} className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors text-base truncate block">
                            {calc.name}
                          </Link>
                        ) : (
                          <h3 className="font-bold text-slate-900 text-base truncate">
                            {calc.name}
                          </h3>
                        )}

                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {calc.shortDescription}
                        </p>
                      </div>

                      {isAvailable && (
                        <Link href={calc.path} className="self-center" aria-label={`Acessar ${calc.name}`}>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">
                Nenhuma calculadora encontrada para &quot;{searchTerm}&quot;. Tente pesquisar por palavras como juros, demissão, rescisão ou aposentadoria.
              </p>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
