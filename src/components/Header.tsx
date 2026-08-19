import Link from 'next/link';
import { Calculator } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:bg-sky-700 transition-colors">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
              Cálculos<span className="text-sky-600">.com</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 leading-tight">
              Plataforma AssinaJur
            </span>
          </div>
        </Link>

        {/* Category Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/#categorias" className="hover:text-sky-600 transition-colors">
            Categorias
          </Link>
          <Link href="/financeiro/juros-compostos" className="hover:text-sky-600 transition-colors">
            Juros Compostos
          </Link>
          <Link href="/trabalhista" className="hover:text-sky-600 transition-colors">
            Trabalhista
          </Link>
          <Link href="/juridico" className="hover:text-sky-600 transition-colors font-medium text-slate-700">
            Jurídico
          </Link>
        </nav>

        {/* Quick Badge */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Gratuito & Preciso
          </span>
        </div>

      </div>
    </header>
  );
}
