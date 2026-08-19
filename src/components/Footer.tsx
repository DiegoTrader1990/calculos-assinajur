import Link from 'next/link';
import { Calculator, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Cálculos<span className="text-sky-400">.AssinaJur</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-4">
              Portal público de ferramentas matemáticas, financeiras, previdenciárias e jurídicas.
              Projetado para oferecer respostas rápidas, simples e confiáveis para qualquer pessoa ou profissional.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cálculos executados localmente no seu navegador com total privacidade.
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Categorias</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#categorias" className="hover:text-sky-400 transition-colors">Financeiro & Investimentos</Link></li>
              <li><Link href="/#categorias" className="hover:text-sky-400 transition-colors">Trabalhista & Rescisão</Link></li>
              <li><Link href="/#categorias" className="hover:text-sky-400 transition-colors">Previdenciário & INSS</Link></li>
              <li><Link href="/#categorias" className="hover:text-sky-400 transition-colors">Jurídico & Correção Monetária</Link></li>
              <li><Link href="/#categorias" className="hover:text-sky-400 transition-colors">Imobiliário & Aluguel</Link></li>
              <li><Link href="/#categorias" className="hover:text-sky-400 transition-colors">Empresarial & Custos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Calculadoras</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/financeiro/juros-compostos" className="text-sky-400 hover:underline">Juros Compostos</Link></li>
              <li className="text-slate-500">Rescisão CLT (Em breve)</li>
              <li className="text-slate-500">Atualização TJSP / SELIC (Em breve)</li>
              <li className="text-slate-500">Aposentadoria RMI (Em breve)</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AssinaJur. Todos os direitos reservados.</p>
          <p className="text-center sm:text-right">
            Aviso: Os cálculos são simulações educativas e informativas. Não substituem consultoria formal ou parecer pericial.
          </p>
        </div>
      </div>
    </footer>
  );
}
