'use client';

import { useState, useMemo } from 'react';
import {
  calculateJurosCompostos,
  formatBRL,
  formatPercent,
  parseBrazilianNumber,
  JurosCompostosParams
} from '@/lib/calculators/juros-compostos';
import { Calculator, RefreshCw, TrendingUp, Layers, Info, CheckCircle2, BarChart2 } from 'lucide-react';

export default function JurosCompostosCalculator() {
  // Strings de entrada para permitir digitação livre (vírgulas, pontos)
  const [valorInicialStr, setValorInicialStr] = useState<string>('1.000,00');
  const [aporteMensalStr, setAporteMensalStr] = useState<string>('300,00');
  const [taxaJurosStr, setTaxaJurosStr] = useState<string>('1,00');
  const [tipoTaxa, setTipoTaxa] = useState<'mensal' | 'anual'>('mensal');
  const [periodoStr, setPeriodoStr] = useState<string>('5');
  const [tipoPeriodo, setTipoPeriodo] = useState<'meses' | 'anos'>('anos');

  // Alternância de visualização da tabela (Anual por padrão / Detalhado Mês a Mês)
  const [tabelaModo, setTabelaModo] = useState<'anual' | 'mensal'>('anual');

  // Parâmetros computados
  const params: JurosCompostosParams = useMemo(() => {
    return {
      valorInicial: parseBrazilianNumber(valorInicialStr),
      aporteMensal: parseBrazilianNumber(aporteMensalStr),
      taxaJuros: parseBrazilianNumber(taxaJurosStr),
      tipoTaxa,
      periodo: parseBrazilianNumber(periodoStr),
      tipoPeriodo,
    };
  }, [valorInicialStr, aporteMensalStr, taxaJurosStr, tipoTaxa, periodoStr, tipoPeriodo]);

  // Resultado do motor matemático
  const result = useMemo(() => {
    return calculateJurosCompostos(params);
  }, [params]);

  const handleReset = () => {
    setValorInicialStr('1.000,00');
    setAporteMensalStr('300,00');
    setTaxaJurosStr('1,00');
    setTipoTaxa('mensal');
    setPeriodoStr('5');
    setTipoPeriodo('anos');
    setTabelaModo('anual');
  };

  const tableData = tabelaModo === 'anual' ? result.yearlyBreakdown : result.breakdown;

  return (
    <div className="space-y-8">
      
      {/* Parameters Input Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Parâmetros da Simulação
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors bg-slate-100 hover:bg-sky-50 px-3 py-1.5 rounded-lg"
            type="button"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Redefinir
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Valor Inicial */}
          <div>
            <label htmlFor="valorInicial" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Valor Inicial (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
                R$
              </span>
              <input
                id="valorInicial"
                type="text"
                value={valorInicialStr}
                onChange={(e) => setValorInicialStr(e.target.value)}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            {result.errors.valorInicial && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{result.errors.valorInicial}</p>
            )}
          </div>

          {/* Aporte Mensal */}
          <div>
            <label htmlFor="aporteMensal" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Aporte Mensal (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
                R$
              </span>
              <input
                id="aporteMensal"
                type="text"
                value={aporteMensalStr}
                onChange={(e) => setAporteMensalStr(e.target.value)}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            {result.errors.aporteMensal && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{result.errors.aporteMensal}</p>
            )}
          </div>

          {/* Taxa de Juros */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="taxaJuros" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Taxa de Juros (%)
              </label>
              <div className="flex bg-slate-100 rounded-lg p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setTipoTaxa('mensal')}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${
                    tipoTaxa === 'mensal' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  a.m.
                </button>
                <button
                  type="button"
                  onClick={() => setTipoTaxa('anual')}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${
                    tipoTaxa === 'anual' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  a.a.
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                id="taxaJuros"
                type="text"
                value={taxaJurosStr}
                onChange={(e) => setTaxaJurosStr(e.target.value)}
                placeholder="0,00"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            {result.errors.taxaJuros && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{result.errors.taxaJuros}</p>
            )}
          </div>

          {/* Período */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="periodo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Período
              </label>
              <div className="flex bg-slate-100 rounded-lg p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setTipoPeriodo('anos')}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${
                    tipoPeriodo === 'anos' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Anos
                </button>
                <button
                  type="button"
                  onClick={() => setTipoPeriodo('meses')}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${
                    tipoPeriodo === 'meses' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Meses
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                id="periodo"
                type="text"
                value={periodoStr}
                onChange={(e) => setPeriodoStr(e.target.value)}
                placeholder="1"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            {result.errors.periodo && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{result.errors.periodo}</p>
            )}
          </div>

        </div>

        {/* Rate Conversion Info Indicator */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
            <span>
              Taxa mensal equivalente: <strong>{formatPercent(result.taxaMensalEfetiva, 4)} a.m.</strong>
              &nbsp;(ou <strong>{formatPercent(result.taxaAnualEquivalente, 2)} a.a.</strong>)
            </span>
          </div>
          <span className="text-slate-400">Aportes efetuados ao final de cada período.</span>
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

        {/* Mobile order: 1. Valor Total Final, 2. Total Investido, 3. Total em Juros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          
          {/* Valor Total Final (Order 1 on mobile, Order 3 on desktop) */}
          <div className="order-1 md:order-3 p-5 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Valor Total Final
            </span>
            <div className="text-3xl font-extrabold text-sky-400">
              {formatBRL(result.totalFinal)}
            </div>
            <span className="text-xs text-slate-400 mt-1 block font-medium">
              Acumulado em {result.totalMeses} meses
            </span>
          </div>

          {/* Valor Total Investido (Order 2 on mobile, Order 1 on desktop) */}
          <div className="order-2 md:order-1 p-5 rounded-2xl bg-sky-50/70 border border-sky-100">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block mb-1">
              Valor Total Investido
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatBRL(result.totalInvested)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              {formatPercent(result.percentInvested, 1)} do valor total acumulado
            </span>
          </div>

          {/* Total em Juros Ganhos (Order 3 on mobile, Order 2 on desktop) */}
          <div className="order-3 md:order-2 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Total em Juros Ganhos
            </span>
            <div className="text-2xl font-extrabold text-emerald-700">
              +{formatBRL(result.totalInterest)}
            </div>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">
              +{formatPercent(result.percentInterest, 1)} gerados por juros
            </span>
          </div>

        </div>

        {/* Visual Composition Progress Bar */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Composição do Patrimônio</span>
            <span>
              {formatPercent(result.percentInvested, 0)} Investimento x {formatPercent(result.percentInterest, 0)} Juros
            </span>
          </div>
          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.max(0, Math.min(100, result.percentInvested))}%` }}
              className="bg-sky-500 h-full transition-all duration-300"
              title="Total Investido"
            />
            <div
              style={{ width: `${Math.max(0, Math.min(100, result.percentInterest))}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
              title="Juros compostos acumulados"
            />
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              <span>Total Investido ({formatBRL(result.totalInvested)})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Juros Ganhos ({formatBRL(result.totalInterest)})</span>
            </div>
          </div>
        </div>

        {/* Lightweight SVG/CSS Evolution Chart */}
        <div className="pt-6 border-t border-slate-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sky-600" />
              Evolução Patrimonial ao longo do Tempo
            </h3>
            <span className="text-xs text-slate-400">Acúmulo progressivo</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="h-44 w-full flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 px-2">
              {result.yearlyBreakdown.map((row) => {
                const heightPercent = result.totalFinal > 0 ? (row.totalBalance / result.totalFinal) * 100 : 0;
                const investedHeightPercent = result.totalFinal > 0 ? (row.totalInvested / result.totalFinal) * 100 : 0;

                return (
                  <div key={row.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                      Ano {row.year}: {formatBRL(row.totalBalance)}
                    </div>

                    <div className="w-full max-w-[28px] bg-slate-200 rounded-t-sm overflow-hidden flex flex-col justify-end transition-all relative" style={{ height: `${Math.max(5, heightPercent)}%` }}>
                      <div className="w-full bg-emerald-500 transition-all" style={{ height: `${Math.max(0, heightPercent - investedHeightPercent)}%` }} />
                      <div className="w-full bg-sky-500 transition-all" style={{ height: `${investedHeightPercent}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-2 truncate max-w-full">
                      A{row.year}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              Tabela de Evolução ({tabelaModo === 'anual' ? 'Resumo Anual' : 'Mês a Mês'})
            </h3>

            <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setTabelaModo('anual')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  tabelaModo === 'anual' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Visão Anual
              </button>
              <button
                type="button"
                onClick={() => setTabelaModo('mensal')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  tabelaModo === 'mensal' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mês a Mês
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Período</th>
                  <th className="py-3 px-4">Aporte Mês</th>
                  <th className="py-3 px-4">Juros Mês</th>
                  <th className="py-3 px-4">Juros Acumulados</th>
                  <th className="py-3 px-4">Total Investido</th>
                  <th className="py-3 px-4 text-right">Saldo Acumulado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      Mês {row.month} {row.monthInYear === 12 ? `(Ano ${row.year})` : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {formatBRL(row.depositedThisMonth)}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-medium whitespace-nowrap">
                      +{formatBRL(row.monthlyInterest)}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold whitespace-nowrap">
                      +{formatBRL(row.totalInterest)}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {formatBRL(row.totalInvested)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
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
