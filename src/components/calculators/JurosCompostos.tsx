'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  calculateJurosCompostos,
  compareScenarios,
  solveFinancialGoal,
  getWhatIfOptions,
  serializeParamsToURL,
  parseParamsFromURL,
  formatBRL,
  formatPercent,
  parseBrazilianNumber,
  JurosCompostosParams,
  JurosCompostosResult
} from '@/lib/calculators/juros-compostos';
import {
  Calculator,
  RefreshCw,
  TrendingUp,
  Layers,
  Info,
  CheckCircle2,
  BarChart2,
  Copy,
  Share2,
  Check,
  Target,
  Sparkles,
  HelpCircle,
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Split
} from 'lucide-react';

interface JurosCompostosCalculatorProps {
  initialSearchParams?: Record<string, string | string[] | undefined>;
}

const STORAGE_LAST_KEY = 'calculos_assinajur_juros_last';
const STORAGE_HISTORY_KEY = 'calculos_assinajur_juros_history';

export default function JurosCompostosCalculator({ initialSearchParams }: JurosCompostosCalculatorProps) {
  const defaultParams: JurosCompostosParams = {
    valorInicial: '1.000,00',
    aporteMensal: '300,00',
    taxaJuros: '1,00',
    tipoTaxa: 'mensal',
    periodo: '5',
    tipoPeriodo: 'anos',
  };

  const [valorInicialStr, setValorInicialStr] = useState<string>('1.000,00');
  const [aporteMensalStr, setAporteMensalStr] = useState<string>('300,00');
  const [taxaJurosStr, setTaxaJurosStr] = useState<string>('1,00');
  const [tipoTaxa, setTipoTaxa] = useState<'mensal' | 'anual'>('mensal');
  const [periodoStr, setPeriodoStr] = useState<string>('5');
  const [tipoPeriodo, setTipoPeriodo] = useState<'meses' | 'anos'>('anos');

  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [tabelaModo, setTabelaModo] = useState<'anual' | 'mensal'>('anual');
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // MODO COMPARAR CENÁRIOS
  const [showCompareMode, setShowCompareMode] = useState<boolean>(false);
  const [scenarioBValorInicial, setScenarioBValorInicial] = useState<string>('1.000,00');
  const [scenarioBAporteMensal, setScenarioBAporteMensal] = useState<string>('500,00');
  const [scenarioBTaxaJuros, setScenarioBTaxaJuros] = useState<string>('1,00');
  const [scenarioBPeriodo, setScenarioBPeriodo] = useState<string>('5');

  // METAS FINANCEIRAS
  const [showGoalsWidget, setShowGoalsWidget] = useState<boolean>(false);
  const [metaValorStr, setMetaValorStr] = useState<string>('100.000,00');

  // HISTÓRICO LOCAL
  const [lastSavedCalc, setLastSavedCalc] = useState<{ label: string; date: string; params: JurosCompostosParams } | null>(null);
  const [historyList, setHistoryList] = useState<Array<{ id: string; label: string; date: string; params: JurosCompostosParams }>>([]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);

  // Ponto ativo no gráfico
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  useEffect(() => {
    if (initialSearchParams) {
      const urlParsed = parseParamsFromURL(initialSearchParams);
      if (urlParsed) {
        setValorInicialStr(String(urlParsed.valorInicial));
        setAporteMensalStr(String(urlParsed.aporteMensal));
        setTaxaJurosStr(String(urlParsed.taxaJuros));
        setTipoTaxa(urlParsed.tipoTaxa);
        setPeriodoStr(String(urlParsed.periodo));
        setTipoPeriodo(urlParsed.tipoPeriodo);
        setHasCalculated(true);
        return;
      }
    }

    try {
      const lastStr = localStorage.getItem(STORAGE_LAST_KEY);
      if (lastStr) {
        const parsed = JSON.parse(lastStr);
        setLastSavedCalc(parsed);
      }
      const histStr = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (histStr) {
        const parsedHist = JSON.parse(histStr);
        if (Array.isArray(parsedHist)) setHistoryList(parsedHist);
      }
    } catch {}
  }, [initialSearchParams]);

  const paramsA: JurosCompostosParams = useMemo(() => {
    return {
      valorInicial: parseBrazilianNumber(valorInicialStr),
      aporteMensal: parseBrazilianNumber(aporteMensalStr),
      taxaJuros: parseBrazilianNumber(taxaJurosStr),
      tipoTaxa,
      periodo: parseBrazilianNumber(periodoStr),
      tipoPeriodo,
    };
  }, [valorInicialStr, aporteMensalStr, taxaJurosStr, tipoTaxa, periodoStr, tipoPeriodo]);

  const resultA: JurosCompostosResult = useMemo(() => {
    return calculateJurosCompostos(paramsA);
  }, [paramsA]);

  const handlePerformCalculation = () => {
    setHasCalculated(true);
    try {
      const label = `R$ ${paramsA.valorInicial} inic. + R$ ${paramsA.aporteMensal}/mês (${paramsA.periodo} ${paramsA.tipoPeriodo})`;
      const record = {
        label,
        date: new Date().toLocaleDateString('pt-BR'),
        params: paramsA,
      };
      localStorage.setItem(STORAGE_LAST_KEY, JSON.stringify(record));

      const newHist = [
        { id: String(Date.now()), ...record },
        ...historyList.filter((h) => h.label !== label).slice(0, 4),
      ];
      setHistoryList(newHist);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(newHist));
    } catch {}
  };

  const handleRestoreLast = (restoredParams: JurosCompostosParams) => {
    setValorInicialStr(String(restoredParams.valorInicial));
    setAporteMensalStr(String(restoredParams.aporteMensal));
    setTaxaJurosStr(String(restoredParams.taxaJuros));
    setTipoTaxa(restoredParams.tipoTaxa);
    setPeriodoStr(String(restoredParams.periodo));
    setTipoPeriodo(restoredParams.tipoPeriodo);
    setHasCalculated(true);
  };

  const handleClearHistory = () => {
    setHistoryList([]);
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch {}
  };

  const paramsB: JurosCompostosParams = useMemo(() => {
    return {
      valorInicial: parseBrazilianNumber(scenarioBValorInicial),
      aporteMensal: parseBrazilianNumber(scenarioBAporteMensal),
      taxaJuros: parseBrazilianNumber(scenarioBTaxaJuros),
      tipoTaxa,
      periodo: parseBrazilianNumber(scenarioBPeriodo),
      tipoPeriodo,
    };
  }, [scenarioBValorInicial, scenarioBAporteMensal, scenarioBTaxaJuros, scenarioBPeriodo, tipoTaxa, tipoPeriodo]);

  const scenarioComparison = useMemo(() => {
    return compareScenarios(paramsA, paramsB);
  }, [paramsA, paramsB]);

  const whatIfOptions = useMemo(() => {
    return getWhatIfOptions(paramsA);
  }, [paramsA]);

  const goalResult = useMemo(() => {
    return solveFinancialGoal({
      metaValor: metaValorStr,
      valorInicial: paramsA.valorInicial,
      aporteMensal: paramsA.aporteMensal,
      taxaJuros: paramsA.taxaJuros,
      tipoTaxa: paramsA.tipoTaxa,
      periodoAnos: paramsA.tipoPeriodo === 'anos' ? paramsA.periodo : Number(paramsA.periodo) / 12,
    });
  }, [metaValorStr, paramsA]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(resultA.textResumoCopiar);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch {}
  };

  const handleShareURL = async () => {
    const urlParams = serializeParamsToURL(paramsA);
    const fullURL = `${window.location.origin}${window.location.pathname}?${urlParams}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Simulação de Juros Compostos — Cálculos por AssinaJur',
          url: fullURL,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(fullURL);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch {}
  };

  const handleResetForm = () => {
    setValorInicialStr(defaultParams.valorInicial as string);
    setAporteMensalStr(defaultParams.aporteMensal as string);
    setTaxaJurosStr(defaultParams.taxaJuros as string);
    setTipoTaxa('mensal');
    setPeriodoStr(defaultParams.periodo as string);
    setTipoPeriodo('anos');
    setShowCompareMode(false);
    setShowGoalsWidget(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Banner de Restauração de Último Cálculo */}
      {lastSavedCalc && !initialSearchParams && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-sky-900">
            <History className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>
              <strong>Continuar seu último cálculo:</strong> {lastSavedCalc.label} (Salvo localmente em {lastSavedCalc.date})
            </span>
          </div>
          <button
            onClick={() => handleRestoreLast(lastSavedCalc.params)}
            className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors flex-shrink-0"
          >
            Carregar
          </button>
        </div>
      )}

      {/* Main Parameters Card */}
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
          
          <div className="flex items-center gap-2">
            {historyList.length > 0 && (
              <button
                onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg"
                title="Ver histórico recente salvo localmente"
              >
                <History className="w-3.5 h-3.5" />
                Histórico ({historyList.length})
              </button>
            )}
            <button
              onClick={handleResetForm}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors bg-slate-100 hover:bg-sky-50 px-3 py-1.5 rounded-lg"
              type="button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Redefinir
            </button>
          </div>
        </div>

        {/* Preset Quick Shortcuts */}
        <div className="mb-6 flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="text-slate-400 mr-1">Atalhos rápidos:</span>
          <button
            onClick={() => { setPeriodoStr('5'); setTipoPeriodo('anos'); }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 transition-colors"
          >
            5 Anos
          </button>
          <button
            onClick={() => { setPeriodoStr('10'); setTipoPeriodo('anos'); }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 transition-colors"
          >
            10 Anos
          </button>
          <button
            onClick={() => { setPeriodoStr('20'); setTipoPeriodo('anos'); }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 transition-colors"
          >
            20 Anos
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setAporteMensalStr('100,00')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 transition-colors"
          >
            R$ 100/mês
          </button>
          <button
            onClick={() => setAporteMensalStr('500,00')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 transition-colors"
          >
            R$ 500/mês
          </button>
          <button
            onClick={() => setAporteMensalStr('1.000,00')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 transition-colors"
          >
            R$ 1.000/mês
          </button>
        </div>

        {/* Inputs Grid */}
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
                onChange={(e) => {
                  setValorInicialStr(e.target.value);
                  handlePerformCalculation();
                }}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            {resultA.errors.valorInicial && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{resultA.errors.valorInicial}</p>
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
                onChange={(e) => {
                  setAporteMensalStr(e.target.value);
                  handlePerformCalculation();
                }}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            {resultA.errors.aporteMensal && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{resultA.errors.aporteMensal}</p>
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
                  onClick={() => { setTipoTaxa('mensal'); handlePerformCalculation(); }}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${
                    tipoTaxa === 'mensal' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  a.m.
                </button>
                <button
                  type="button"
                  onClick={() => { setTipoTaxa('anual'); handlePerformCalculation(); }}
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
                onChange={(e) => {
                  setTaxaJurosStr(e.target.value);
                  handlePerformCalculation();
                }}
                placeholder="0,00"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            {resultA.errors.taxaJuros && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{resultA.errors.taxaJuros}</p>
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
                  onClick={() => { setTipoPeriodo('anos'); handlePerformCalculation(); }}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${
                    tipoPeriodo === 'anos' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Anos
                </button>
                <button
                  type="button"
                  onClick={() => { setTipoPeriodo('meses'); handlePerformCalculation(); }}
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
                onChange={(e) => {
                  setPeriodoStr(e.target.value);
                  handlePerformCalculation();
                }}
                placeholder="1"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            {resultA.errors.periodo && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{resultA.errors.periodo}</p>
            )}
          </div>

        </div>

        {/* Rate Conversion Indicator */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
            <span>
              Taxa mensal equivalente: <strong>{formatPercent(resultA.taxaMensalEfetiva, 4)} a.m.</strong>
              &nbsp;(ou <strong>{formatPercent(resultA.taxaAnualEquivalente, 2)} a.a.</strong>)
            </span>
          </div>
          <span className="text-slate-400">Aportes efetuados ao final de cada período (postcipados).</span>
        </div>

        {/* Botão de Recálculo */}
        <div className="mt-5 pt-3 flex items-center justify-between">
          <button
            onClick={handlePerformCalculation}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calcular Juros Compostos
          </button>
        </div>

      </div>

      {/* Histórico Local Drawer */}
      {showHistoryDrawer && historyList.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-sky-600" />
              Histórico Recente de Cálculos (Dispositivo)
            </h3>
            <button
              onClick={handleClearHistory}
              className="text-xs text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpar
            </button>
          </div>
          <div className="space-y-2">
            {historyList.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block">{item.label}</span>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>
                <button
                  onClick={() => handleRestoreLast(item.params)}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-700 hover:text-sky-600 hover:border-sky-300 transition-colors"
                >
                  Abrir
                </button>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Os cálculos recentes ficam salvos somente neste dispositivo via localStorage.
          </p>
        </div>
      )}

      {/* Results Highlight Cards */}
      {hasCalculated && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Resultado da Simulação
              </h2>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                title="Copiar texto resumo formatado"
              >
                {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSuccess ? 'Copiado!' : 'Copiar Resultado'}
              </button>

              <button
                onClick={handleShareURL}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                title="Gerar link compartilhável desta simulação"
              >
                {shareSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                {shareSuccess ? 'Link Copiado!' : 'Compartilhar'}
              </button>

              <button
                onClick={() => setShowCompareMode(!showCompareMode)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  showCompareMode ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                {showCompareMode ? 'Fechar Comparação' : 'Comparar Cenários'}
              </button>

              <button
                onClick={() => setShowGoalsWidget(!showGoalsWidget)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  showGoalsWidget ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                {showGoalsWidget ? 'Fechar Metas' : 'Simular Metas'}
              </button>
            </div>
          </div>

          {/* Mobile Order Priority: (1) Valor Total Final, (2) Total Investido, (3) Total em Juros Ganhos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Valor Total Final (Order 1 on mobile, Order 3 on desktop) */}
            <div className="order-1 md:order-3 p-5 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10 border border-slate-800 relative overflow-hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Valor Total Final
              </span>
              <div className="text-3xl font-extrabold text-sky-400">
                {formatBRL(resultA.totalFinal)}
              </div>
              <span className="text-xs text-slate-400 mt-1.5 block font-medium">
                Em {resultA.totalMeses} meses ({resultA.yearlyBreakdown.length} anos)
              </span>
            </div>

            {/* Valor Total Investido (Order 2 on mobile, Order 1 on desktop) */}
            <div className="order-2 md:order-1 p-5 rounded-2xl bg-sky-50/70 border border-sky-100">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block mb-1">
                Valor Total Investido
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                {formatBRL(resultA.totalInvested)}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                {formatPercent(resultA.percentInvested, 1)} do valor total acumulado
              </span>
            </div>

            {/* Total em Juros Ganhos (Order 3 on mobile, Order 2 on desktop) */}
            <div className="order-3 md:order-2 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Total em Juros Ganhos
              </span>
              <div className="text-2xl font-extrabold text-emerald-700">
                +{formatBRL(resultA.totalInterest)}
              </div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                +{formatPercent(resultA.percentInterest, 1)} gerados por juros
              </span>
            </div>

          </div>

          {/* Seção 11 e 12: Entenda seu resultado & Quanto os juros fizeram por você */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Entenda seu Resultado
              </h3>
              <p>{resultA.textEntendaSeuResultado}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Quanto os juros fizeram por você?
              </h3>
              <p>{resultA.textQuantoJurosFizeram}</p>
            </div>
          </div>

          {/* Visual Composition Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Composição do Saldo Final</span>
              <span>
                {formatPercent(resultA.percentInvested, 0)} Investimento x {formatPercent(resultA.percentInterest, 0)} Juros
              </span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.max(0, Math.min(100, resultA.percentInvested))}%` }}
                className="bg-sky-500 h-full transition-all duration-300"
                title="Total Investido"
              />
              <div
                style={{ width: `${Math.max(0, Math.min(100, resultA.percentInterest))}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title="Juros compostos acumulados"
              />
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                <span>Total Investido ({formatBRL(resultA.totalInvested)})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Juros Ganhos ({formatBRL(resultA.totalInterest)})</span>
              </div>
            </div>
          </div>

          {/* Seção 9: "E se você mudar algumas coisas?" (Quick What-Ifs) */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              E se você mudar algumas coisas?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {whatIfOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setValorInicialStr(String(opt.params.valorInicial));
                    setAporteMensalStr(String(opt.params.aporteMensal));
                    setTaxaJurosStr(String(opt.params.taxaJuros));
                    setPeriodoStr(String(opt.params.periodo));
                    handlePerformCalculation();
                  }}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-sky-50 hover:border-sky-300 text-left transition-all group"
                >
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-sky-600 mb-0.5">
                    {opt.label}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">
                    +{formatBRL(opt.diffAmount)} no saldo final
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* MODO COMPARAR CENÁRIOS */}
          {showCompareMode && (
            <div className="pt-6 border-t border-slate-200 bg-indigo-50/40 p-6 rounded-2xl border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Split className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Comparação de Cenários (Cenário A x Cenário B)
                  </h3>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md">
                  {scenarioComparison.summaryText}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Cenário A */}
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs font-extrabold uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded mb-2 inline-block">
                    Cenário A (Atual)
                  </span>
                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <div>Inicial: {formatBRL(parseBrazilianNumber(paramsA.valorInicial))} | Aporte: {formatBRL(parseBrazilianNumber(paramsA.aporteMensal))}/mês</div>
                    <div>Taxa: {formatPercent(parseBrazilianNumber(paramsA.taxaJuros))} | Prazo: {paramsA.periodo} {paramsA.tipoPeriodo}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                    <div>Investido: <strong>{formatBRL(scenarioComparison.scenarioA.totalInvested)}</strong></div>
                    <div>Juros: <strong className="text-emerald-600">+{formatBRL(scenarioComparison.scenarioA.totalInterest)}</strong></div>
                    <div className="text-sm font-extrabold text-slate-900 pt-1">
                      Final: {formatBRL(scenarioComparison.scenarioA.totalFinal)}
                    </div>
                  </div>
                </div>

                {/* Cenário B */}
                <div className="p-4 rounded-xl bg-white border border-indigo-200 shadow-xs">
                  <span className="text-xs font-extrabold uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded mb-2 inline-block">
                    Cenário B (Comparação)
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Aporte Mensal (R$)</label>
                      <input
                        type="text"
                        value={scenarioBAporteMensal}
                        onChange={(e) => setScenarioBAporteMensal(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Prazo ({tipoPeriodo})</label>
                      <input
                        type="text"
                        value={scenarioBPeriodo}
                        onChange={(e) => setScenarioBPeriodo(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                    <div>Investido: <strong>{formatBRL(scenarioComparison.scenarioB.totalInvested)}</strong></div>
                    <div>Juros: <strong className="text-emerald-600">+{formatBRL(scenarioComparison.scenarioB.totalInterest)}</strong></div>
                    <div className="text-sm font-extrabold text-indigo-700 pt-1">
                      Final: {formatBRL(scenarioComparison.scenarioB.totalFinal)}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* METAS FINANCEIRAS WIDGET */}
          {showGoalsWidget && (
            <div className="pt-6 border-t border-slate-200 bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Quanto preciso investir para atingir minha meta?
                </h3>
              </div>

              <div className="max-w-xs mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Meta Desejada (R$)
                </label>
                <input
                  type="text"
                  value={metaValorStr}
                  onChange={(e) => setMetaValorStr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-amber-300 font-extrabold text-base text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Modo A */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Modo A: Mantendo o aporte atual ({formatBRL(parseBrazilianNumber(paramsA.aporteMensal))}/mês)
                  </h4>
                  <p className="text-slate-600">{goalResult.modoAMensagem}</p>
                </div>

                {/* Modo B */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Modo B: Aporte necessário para meta em {paramsA.periodo} {paramsA.tipoPeriodo}
                  </h4>
                  <p className="text-slate-600">{goalResult.modoBMensagem}</p>
                </div>

              </div>
            </div>
          )}

          {/* Interactive SVG Evolution Chart with Tooltip */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-sky-600" />
                Gráfico Interativo de Evolução Patrimonial
              </h3>
              <span className="text-xs text-slate-400">Toque ou passe o cursor nas barras</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              
              {activeChartPoint !== null && resultA.yearlyBreakdown[activeChartPoint] && (
                <div className="mb-3 p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between shadow-md">
                  <div>
                    <span className="font-bold text-sky-400">Ano {resultA.yearlyBreakdown[activeChartPoint].year}:</span>&nbsp;
                    <span>Investido: {formatBRL(resultA.yearlyBreakdown[activeChartPoint].totalInvested)}</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">Juros: +{formatBRL(resultA.yearlyBreakdown[activeChartPoint].totalInterest)}</span> |&nbsp;
                    <span className="font-extrabold">Saldo: {formatBRL(resultA.yearlyBreakdown[activeChartPoint].totalBalance)}</span>
                  </div>
                </div>
              )}

              <div className="h-44 w-full flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 px-2">
                {resultA.yearlyBreakdown.map((row, idx) => {
                  const heightPercent = resultA.totalFinal > 0 ? (row.totalBalance / resultA.totalFinal) * 100 : 0;
                  const investedHeightPercent = resultA.totalFinal > 0 ? (row.totalInvested / resultA.totalFinal) * 100 : 0;

                  return (
                    <button
                      key={row.month}
                      type="button"
                      onMouseEnter={() => setActiveChartPoint(idx)}
                      onClick={() => setActiveChartPoint(idx)}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative focus:outline-none"
                    >
                      <div className="w-full max-w-[28px] bg-slate-200 rounded-t-sm overflow-hidden flex flex-col justify-end transition-all relative group-hover:opacity-80" style={{ height: `${Math.max(5, heightPercent)}%` }}>
                        <div className="w-full bg-emerald-500 transition-all" style={{ height: `${Math.max(0, heightPercent - investedHeightPercent)}%` }} />
                        <div className="w-full bg-sky-500 transition-all" style={{ height: `${investedHeightPercent}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 mt-2 truncate max-w-full">
                        A{row.year}
                      </span>
                    </button>
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
                  {(tabelaModo === 'anual' ? resultA.yearlyBreakdown : resultA.breakdown).map((row) => (
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

          {/* Ver Fórmula Utilizada */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowFormula(!showFormula)}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5"
            >
              {showFormula ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showFormula ? 'Ocultar Fórmula e Detalhes Acadêmicos' : 'Ver Fórmula Utilizada'}
            </button>

            {showFormula && (
              <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-600">
                <p className="font-bold text-slate-900">Fórmula de Juros Compostos com Aportes Postcipados:</p>
                <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-[11px] text-center font-bold">
                  M = P × (1 + i)^n + PMT × [ ((1 + i)^n - 1) / i ]
                </div>
                <p>
                  <strong>Consideração dos Aportes:</strong> Os depósitos são efetuados no último dia de cada período (postcipados), não rendendo juros no próprio mês de aporte.
                </p>
                <p>
                  <strong>Equivalência de Taxas:</strong> <code className="bg-slate-200 px-1 rounded">i_m = (1 + i_a)^(1/12) - 1</code>
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
