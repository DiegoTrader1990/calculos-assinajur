'use client';

import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Calendar, TrendingUp, RefreshCw, Layers } from 'lucide-react';

interface MonthlyBreakdown {
  month: number;
  totalInvested: number;
  monthlyInterest: number;
  totalInterest: number;
  totalBalance: number;
}

export default function JurosCompostosCalculator() {
  const [valorInicial, setValorInicial] = useState<number>(1000);
  const [aporteMensal, setAporteMensal] = useState<number>(300);
  const [taxaJuros, setTaxaJuros] = useState<number>(1); // %
  const [tipoTaxa, setTipoTaxa] = useState<'mensal' | 'anual'>('mensal');
  const [periodo, setPeriodo] = useState<number>(5); // anos ou meses
  const [tipoPeriodo, setTipoPeriodo] = useState<'meses' | 'anos'>('anos');

  // Mathematical Calculation Engine (Client Side)
  const calculationResults = useMemo(() => {
    const totalMeses = tipoPeriodo === 'anos' ? periodo * 12 : periodo;
    
    // Convert annual rate to monthly compounding rate if needed
    // (1 + r_anual)^(1/12) - 1
    const taxaMensalDecimal =
      tipoTaxa === 'anual'
        ? Math.pow(1 + taxaJuros / 100, 1 / 12) - 1
        : taxaJuros / 100;

    let balance = valorInicial;
    let totalInvested = valorInicial;
    let accumulatedInterest = 0;

    const breakdown: MonthlyBreakdown[] = [];

    for (let m = 1; m <= totalMeses; m++) {
      const interestForMonth = balance * taxaMensalDecimal;
      accumulatedInterest += interestForMonth;
      balance += interestForMonth;

      if (m > 0) {
        balance += aporteMensal;
        totalInvested += aporteMensal;
      }

      breakdown.push({
        month: m,
        totalInvested,
        monthlyInterest: interestForMonth,
        totalInterest: accumulatedInterest,
        totalBalance: balance,
      });
    }

    const totalFinal = balance;
    const totalJuros = accumulatedInterest;
    const percentJuros = totalFinal > 0 ? (totalJuros / totalFinal) * 100 : 0;
    const percentInvestido = totalFinal > 0 ? (totalInvested / totalFinal) * 100 : 0;

    return {
      totalMeses,
      totalInvested,
      totalJuros,
      totalFinal,
      percentJuros,
      percentInvestido,
      breakdown,
    };
  }, [valorInicial, aporteMensal, taxaJuros, tipoTaxa, periodo, tipoPeriodo]);

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleReset = () => {
    setValorInicial(1000);
    setAporteMensal(300);
    setTaxaJuros(1);
    setTipoTaxa('mensal');
    setPeriodo(5);
    setTipoPeriodo('anos');
  };

  return (
    <div className="space-y-8">
      
      {/* Form Input Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Parâmetros do Simulação
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Redefinir
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Valor Inicial */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Valor Inicial (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                R$
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={valorInicial}
                onChange={(e) => setValorInicial(Math.max(0, Number(e.target.value)))}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Aporte Mensal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Aporte Mensal (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                R$
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={aporteMensal}
                onChange={(e) => setAporteMensal(Math.max(0, Number(e.target.value)))}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Taxa de Juros */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Taxa de Juros (%)
              </label>
              <div className="flex bg-slate-100 rounded-lg p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setTipoTaxa('mensal')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    tipoTaxa === 'mensal' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500'
                  }`}
                >
                  a.m.
                </button>
                <button
                  type="button"
                  onClick={() => setTipoTaxa('anual')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    tipoTaxa === 'anual' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500'
                  }`}
                >
                  a.a.
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.1"
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Período */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Período
              </label>
              <div className="flex bg-slate-100 rounded-lg p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setTipoPeriodo('anos')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    tipoPeriodo === 'anos' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Anos
                </button>
                <button
                  type="button"
                  onClick={() => setTipoPeriodo('meses')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    tipoPeriodo === 'meses' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Meses
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="600"
                value={periodo}
                onChange={(e) => setPeriodo(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Results Highlight Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Resultado da Simulação
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          
          <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
              Valor Total Investido
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatBRL(calculationResults.totalInvested)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              {calculationResults.percentInvestido.toFixed(1)}% do valor final
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Total em Juros Ganhos
            </span>
            <div className="text-2xl font-extrabold text-emerald-700">
              +{formatBRL(calculationResults.totalJuros)}
            </div>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">
              +{calculationResults.percentJuros.toFixed(1)}% gerados por juros
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Valor Total Final
            </span>
            <div className="text-2xl font-extrabold text-sky-400">
              {formatBRL(calculationResults.totalFinal)}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Em {calculationResults.totalMeses} meses
            </span>
          </div>

        </div>

        {/* Visual Composition Progress Bar */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Composição do Saldo Final</span>
            <span>{calculationResults.percentInvestido.toFixed(0)}% Investimento vs {calculationResults.percentJuros.toFixed(0)}% Juros</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${calculationResults.percentInvestido}%` }}
              className="bg-sky-500 h-full transition-all duration-500"
              title="Investimento acumulado"
            />
            <div
              style={{ width: `${calculationResults.percentJuros}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title="Juros compostos acumulados"
            />
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              <span>Total Investido ({formatBRL(calculationResults.totalInvested)})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Juros Ganhos ({formatBRL(calculationResults.totalJuros)})</span>
            </div>
          </div>
        </div>

        {/* Monthly / Yearly Breakdown Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              Tabela de Evolução Periódica
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {calculationResults.breakdown.length} meses calculados
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Mês / Período</th>
                  <th className="py-3 px-4">Juros do Mês</th>
                  <th className="py-3 px-4">Juros Acumulados</th>
                  <th className="py-3 px-4">Total Investido</th>
                  <th className="py-3 px-4 text-right">Saldo Acumulado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculationResults.breakdown
                  .filter((b) => b.month % 12 === 0 || b.month === calculationResults.totalMeses || b.month <= 12)
                  .map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        Mês {row.month} {row.month % 12 === 0 ? `(Ano ${row.month / 12})` : ''}
                      </td>
                      <td className="py-3 px-4 text-emerald-600 font-medium">
                        +{formatBRL(row.monthlyInterest)}
                      </td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">
                        +{formatBRL(row.totalInterest)}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formatBRL(row.totalInvested)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatBRL(row.totalBalance)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
