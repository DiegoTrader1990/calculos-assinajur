'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Menu, X, Sparkles } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand: Cálculos por AssinaJur */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Página Inicial Cálculos por AssinaJur">
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:bg-sky-700 transition-colors">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
              Cálculos
            </span>
            <span className="text-[11px] font-medium text-slate-500 leading-tight tracking-wide">
              por AssinaJur
            </span>
          </div>
        </Link>

        {/* Scalable Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <Link href="/calculadoras" className="hover:text-sky-600 transition-colors">
            Calculadoras
          </Link>
          <Link href="/#categorias" className="hover:text-sky-600 transition-colors">
            Categorias
          </Link>
          <Link href="/#populares" className="hover:text-sky-600 transition-colors">
            Mais Utilizadas
          </Link>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 cursor-default" title="Ferramentas prontas para advogados, contadores e peritos">
            <Sparkles className="w-3 h-3 text-sky-600" />
            Para Profissionais
          </span>
        </nav>

        {/* Right Badge */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Grátis, rápido e simples
          </span>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Grátis, rápido e simples
            </span>
          </div>
          <nav className="flex flex-col gap-3 text-base font-semibold text-slate-700">
            <Link
              href="/calculadoras"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Todas as Calculadoras
            </Link>
            <Link
              href="/#categorias"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Categorias
            </Link>
            <Link
              href="/#populares"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Mais Utilizadas
            </Link>
            <Link
              href="/financeiro/juros-compostos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-sky-50 text-sky-700 font-bold"
            >
              Calculadora de Juros Compostos
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
