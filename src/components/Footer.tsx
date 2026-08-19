import Link from 'next/link';
import { Calculator, ShieldCheck } from 'lucide-react';
import { CALCULATOR_CATEGORIES } from '@/data/calculators';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Cálculos
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Cálculos é uma plataforma de ferramentas gratuitas e intuitivas disponibilizada pela AssinaJur para cidadãos e profissionais.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              Cálculos processados no navegador. Total privacidade.
            </div>
          </div>

          {/* Cálculos Column */}
          <div>
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase mb-4">Plataforma</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/calculadoras" className="hover:text-sky-400 transition-colors font-medium">Todas as Calculadoras</Link></li>
              <li><Link href="/#categorias" className="hover:text-sky-400 transition-colors">Categorias de Ferramentas</Link></li>
              <li><Link href="/#populares" className="hover:text-sky-400 transition-colors">Mais Utilizadas</Link></li>
              <li><Link href="/financeiro/juros-compostos" className="text-sky-400 hover:underline">Juros Compostos</Link></li>
            </ul>
          </div>

          {/* Categorias Column */}
          <div>
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase mb-4">Categorias</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {CALCULATOR_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="hover:text-sky-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional Column */}
          <div>
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase mb-4">Institucional</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><span className="text-slate-500 cursor-default">Sobre a Plataforma</span></li>
              <li><span className="text-slate-500 cursor-default">Termos de Uso</span></li>
              <li><span className="text-slate-500 cursor-default">Política de Privacidade</span></li>
              <li><span className="text-slate-500 cursor-default">Contato & Suporte</span></li>
            </ul>
          </div>

        </div>

        {/* Sub-footer Disclaimer & Signature */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Cálculos — Uma plataforma AssinaJur.</p>
          <p className="text-center sm:text-right text-[11px] text-slate-500 max-w-lg">
            Os resultados são simulações educativas e informativas baseadas nos dados fornecidos pelo usuário. Não substituem consultoria formal ou parecer pericial.
          </p>
        </div>
      </div>
    </footer>
  );
}
