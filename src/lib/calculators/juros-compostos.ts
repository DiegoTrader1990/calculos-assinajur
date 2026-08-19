export interface JurosCompostosParams {
  valorInicial: number | string;
  aporteMensal: number | string;
  taxaJuros: number | string;
  tipoTaxa: 'mensal' | 'anual';
  periodo: number | string;
  tipoPeriodo: 'meses' | 'anos';
}

export interface MonthlyBreakdown {
  month: number;
  year: number;
  monthInYear: number;
  depositedThisMonth: number;
  totalInvested: number;
  monthlyInterest: number;
  totalInterest: number;
  totalBalance: number;
}

export interface JurosCompostosResult {
  totalMeses: number;
  taxaMensalEfetiva: number; // % ao mês
  taxaAnualEquivalente: number; // % ao ano
  totalInvested: number;
  totalInterest: number;
  totalFinal: number;
  percentInvested: number;
  percentInterest: number;
  returnOnInvestedPercent: number; // (Juros / Investido) * 100
  breakdown: MonthlyBreakdown[];
  yearlyBreakdown: MonthlyBreakdown[];
  isValid: boolean;
  errors: Record<string, string>;
  
  // Textos gerados dinamicamente
  textEntendaSeuResultado: string;
  textQuantoJurosFizeram: string;
  textResumoCopiar: string;
}

export interface ScenarioComparisonResult {
  scenarioA: JurosCompostosResult;
  scenarioB: JurosCompostosResult;
  diffFinal: number;
  diffInvested: number;
  diffInterest: number;
  diffFinalPercent: number;
  winner: 'A' | 'B' | 'EQUAL';
  summaryText: string;
}

export interface GoalSolverParams {
  metaValor: number | string;
  valorInicial: number | string;
  aporteMensal: number | string;
  taxaJuros: number | string;
  tipoTaxa: 'mensal' | 'anual';
  periodoAnos?: number | string;
}

export interface GoalSolverResult {
  metaValor: number;
  // Modo A: Tempo necessário dado o aporte atual
  modoATempoMeses: number;
  modoATempoAnos: number;
  modoASucesso: boolean;
  modoAMensagem: string;
  
  // Modo B: Aporte necessário para meta no tempo estipulado
  modoBAporteMensal: number;
  modoBSucesso: boolean;
  modoBMensagem: string;
}

export interface WhatIfOption {
  id: string;
  label: string;
  diffAmount: number;
  newTotalFinal: number;
  params: JurosCompostosParams;
}

/**
 * Parseamento seguro de formato numérico brasileiro (ex: "1.000,50" -> 1000.5)
 */
export function parseBrazilianNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0;
  if (typeof value === 'number') return isNaN(value) || !isFinite(value) ? 0 : value;

  const str = String(value).trim();
  if (!str) return 0;

  if (/^-?\d+(\.\d+)?$/.test(str)) {
    const num = parseFloat(str);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  }

  const cleanStr = str.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
}

export function formatBRL(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0,00%';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + '%';
}

/**
 * Equivalência de Taxas de Juros Compostos:
 * i_mensal = (1 + i_anual)^(1/12) - 1
 * i_anual = (1 + i_mensal)^12 - 1
 */
export function convertRate(ratePercent: number, from: 'mensal' | 'anual', to: 'mensal' | 'anual'): number {
  if (ratePercent <= 0) return 0;
  if (from === to) return ratePercent;

  if (from === 'anual' && to === 'mensal') {
    const iAnual = ratePercent / 100;
    const iMensal = Math.pow(1 + iAnual, 1 / 12) - 1;
    return iMensal * 100;
  }

  if (from === 'mensal' && to === 'anual') {
    const iMensal = ratePercent / 100;
    const iAnual = Math.pow(1 + iMensal, 12) - 1;
    return iAnual * 100;
  }

  return ratePercent;
}

/**
 * Função Matemática Central Determinística de Juros Compostos (Aportes ao Final do Mês)
 */
export function calculateJurosCompostos(params: JurosCompostosParams): JurosCompostosResult {
  const errors: Record<string, string> = {};

  const valorInicial = Math.max(0, parseBrazilianNumber(params.valorInicial));
  const aporteMensal = Math.max(0, parseBrazilianNumber(params.aporteMensal));
  const taxaJurosInput = Math.max(0, parseBrazilianNumber(params.taxaJuros));
  const periodoInput = Math.max(0, parseBrazilianNumber(params.periodo));

  if (periodoInput <= 0) {
    errors.periodo = 'O período deve ser maior que zero.';
  } else if (params.tipoPeriodo === 'anos' && periodoInput > 50) {
    errors.periodo = 'O período máximo permitido é de 50 anos (600 meses).';
  } else if (params.tipoPeriodo === 'meses' && periodoInput > 600) {
    errors.periodo = 'O período máximo permitido é de 600 meses (50 anos).';
  }

  if (valorInicial > 1000000000) {
    errors.valorInicial = 'O valor inicial máximo permitido é R$ 1.000.000.000,00.';
  }
  if (aporteMensal > 100000000) {
    errors.aporteMensal = 'O aporte mensal máximo permitido é R$ 100.000.000,00.';
  }
  if (taxaJurosInput > 500) {
    errors.taxaJuros = 'A taxa de juros informada excede o limite praticável.';
  }

  const isValid = Object.keys(errors).length === 0;

  const totalMeses = Math.min(
    600,
    Math.max(1, Math.round(params.tipoPeriodo === 'anos' ? periodoInput * 12 : periodoInput))
  );

  const taxaMensalPercent =
    params.tipoTaxa === 'anual'
      ? convertRate(taxaJurosInput, 'anual', 'mensal')
      : taxaJurosInput;

  const taxaAnualEquivalente =
    params.tipoTaxa === 'mensal'
      ? convertRate(taxaJurosInput, 'mensal', 'anual')
      : taxaJurosInput;

  const i = taxaMensalPercent / 100;

  let currentBalance = valorInicial;
  let totalInvested = valorInicial;
  let accumulatedInterest = 0;

  const breakdown: MonthlyBreakdown[] = [];

  for (let m = 1; m <= totalMeses; m++) {
    const interestForMonth = currentBalance * i;
    accumulatedInterest += interestForMonth;
    currentBalance += interestForMonth;

    currentBalance += aporteMensal;
    totalInvested += aporteMensal;

    const year = Math.ceil(m / 12);
    const monthInYear = m % 12 === 0 ? 12 : m % 12;

    breakdown.push({
      month: m,
      year,
      monthInYear,
      depositedThisMonth: aporteMensal,
      totalInvested,
      monthlyInterest: interestForMonth,
      totalInterest: accumulatedInterest,
      totalBalance: currentBalance,
    });
  }

  const totalFinal = currentBalance;
  const totalInterest = accumulatedInterest;

  let percentInvested = 0;
  let percentInterest = 0;
  let returnOnInvestedPercent = 0;

  if (totalFinal > 0) {
    percentInvested = Math.min(100, Math.max(0, (totalInvested / totalFinal) * 100));
    percentInterest = Math.min(100, Math.max(0, (totalInterest / totalFinal) * 100));
  }

  if (totalInvested > 0) {
    returnOnInvestedPercent = (totalInterest / totalInvested) * 100;
  }

  const yearlyBreakdown = breakdown.filter(
    (b) => b.monthInYear === 12 || b.month === totalMeses
  );

  // Textos explicativos gerados deterministicamente a partir dos números
  const anosTexto = params.tipoPeriodo === 'anos' ? `${periodoInput} anos` : `${totalMeses} meses`;
  
  const textEntendaSeuResultado =
    `Ao longo de ${anosTexto}, você aplicará um total de ${formatBRL(totalInvested)}. ` +
    `Com a taxa de ${formatPercent(taxaJurosInput)} ${params.tipoTaxa === 'anual' ? 'ao ano' : 'ao mês'}, ` +
    `os juros compostos adicionarão aproximadamente ${formatBRL(totalInterest)}, ` +
    `elevando o seu saldo final estimado para ${formatBRL(totalFinal)}.`;

  const textQuantoJurosFizeram =
    `${formatPercent(percentInterest, 1)} do seu patrimônio final virá diretamente dos juros. ` +
    `Você investe ${formatBRL(totalInvested)} e o efeito acumulado dos juros adiciona ${formatBRL(totalInterest)} ao seu saldo.`;

  const textResumoCopiar =
    `Investindo ${formatBRL(valorInicial)} inicialmente e ${formatBRL(aporteMensal)}/mês durante ${anosTexto}, ` +
    `com taxa de ${formatPercent(taxaJurosInput)} ${params.tipoTaxa === 'anual' ? 'a.a.' : 'a.m.'}, ` +
    `o saldo final estimado é de ${formatBRL(totalFinal)} (sendo ${formatBRL(totalInterest)} em juros). ` +
    `Simulado via Cálculos por AssinaJur: https://calculos.assinajur.com.br/financeiro/juros-compostos`;

  return {
    totalMeses,
    taxaMensalEfetiva: taxaMensalPercent,
    taxaAnualEquivalente,
    totalInvested,
    totalInterest,
    totalFinal,
    percentInvested,
    percentInterest,
    returnOnInvestedPercent,
    breakdown,
    yearlyBreakdown,
    isValid,
    errors,
    textEntendaSeuResultado,
    textQuantoJurosFizeram,
    textResumoCopiar,
  };
}

/**
 * Compara dois cenários (A e B) e calcula a diferença determinística
 */
export function compareScenarios(paramsA: JurosCompostosParams, paramsB: JurosCompostosParams): ScenarioComparisonResult {
  const scenarioA = calculateJurosCompostos(paramsA);
  const scenarioB = calculateJurosCompostos(paramsB);

  const diffFinal = scenarioB.totalFinal - scenarioA.totalFinal;
  const diffInvested = scenarioB.totalInvested - scenarioA.totalInvested;
  const diffInterest = scenarioB.totalInterest - scenarioA.totalInterest;

  let diffFinalPercent = 0;
  if (scenarioA.totalFinal > 0) {
    diffFinalPercent = (diffFinal / scenarioA.totalFinal) * 100;
  }

  let winner: 'A' | 'B' | 'EQUAL' = 'EQUAL';
  if (diffFinal > 0.01) winner = 'B';
  else if (diffFinal < -0.01) winner = 'A';

  let summaryText = '';
  if (winner === 'B') {
    summaryText = `O Cenário B gera ${formatBRL(Math.abs(diffFinal))} a mais (+${formatPercent(Math.abs(diffFinalPercent), 1)}) ao final do período.`;
  } else if (winner === 'A') {
    summaryText = `O Cenário A gera ${formatBRL(Math.abs(diffFinal))} a mais (+${formatPercent(Math.abs(diffFinalPercent), 1)}) em relação ao Cenário B.`;
  } else {
    summaryText = `Ambos os cenários resultam no mesmo valor estimado final.`;
  }

  return {
    scenarioA,
    scenarioB,
    diffFinal,
    diffInvested,
    diffInterest,
    diffFinalPercent,
    winner,
    summaryText,
  };
}

/**
 * Solver de Metas Financeiras (Modos A e B)
 */
export function solveFinancialGoal(params: GoalSolverParams): GoalSolverResult {
  const metaValor = Math.max(0, parseBrazilianNumber(params.metaValor));
  const valorInicial = Math.max(0, parseBrazilianNumber(params.valorInicial));
  const aporteMensal = Math.max(0, parseBrazilianNumber(params.aporteMensal));
  const taxaJurosInput = Math.max(0, parseBrazilianNumber(params.taxaJuros));
  const periodoAnosTarget = Math.max(1, parseBrazilianNumber(params.periodoAnos || 10));

  const iMensalPercent =
    params.tipoTaxa === 'anual'
      ? convertRate(taxaJurosInput, 'anual', 'mensal')
      : taxaJurosInput;

  const i = iMensalPercent / 100;

  // --- Modo A: Tempo necessário dado o aporte mensal atual ---
  let modoATempoMeses = 0;
  let modoASucesso = false;
  let modoAMensagem = '';

  if (metaValor <= valorInicial) {
    modoASucesso = true;
    modoATempoMeses = 0;
    modoAMensagem = 'Sua meta já é menor ou igual ao seu valor inicial!';
  } else if (i <= 0 && aporteMensal <= 0) {
    modoASucesso = false;
    modoAMensagem = 'Defina um aporte mensal ou uma taxa de juros maior que zero para alcançar a meta.';
  } else {
    // Busca iterativa segura (até 600 meses / 50 anos)
    let balance = valorInicial;
    let m = 0;
    while (balance < metaValor && m < 600) {
      m++;
      balance += balance * i;
      balance += aporteMensal;
    }

    if (balance >= metaValor) {
      modoASucesso = true;
      modoATempoMeses = m;
      const anos = Math.floor(m / 12);
      const mesesRestantes = m % 12;
      let tempoStr = '';
      if (anos > 0) tempoStr += `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
      if (mesesRestantes > 0) {
        if (tempoStr) tempoStr += ' e ';
        tempoStr += `${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`;
      }
      modoAMensagem = `Com os parâmetros atuais, você atingirá ${formatBRL(metaValor)} em aproximadamente ${tempoStr}.`;
    } else {
      modoASucesso = false;
      modoAMensagem = `Com estes aportes, seriam necessários mais de 50 anos para atingir ${formatBRL(metaValor)}. Considere aumentar o aporte mensal.`;
    }
  }

  // --- Modo B: Aporte mensal necessário para meta em X anos ---
  let modoBAporteMensal = 0;
  let modoBSucesso = false;
  let modoBMensagem = '';

  const nTargetMeses = Math.min(600, Math.max(1, Math.round(periodoAnosTarget * 12)));

  if (metaValor <= valorInicial) {
    modoBSucesso = true;
    modoBAporteMensal = 0;
    modoBMensagem = 'Seu valor inicial já atinge o objetivo almejado.';
  } else {
    // Se i = 0: PMT = (Meta - P) / n
    // Se i > 0: PMT = (Meta - P*(1+i)^n) / [ ((1+i)^n - 1) / i ]
    const compoundFactor = Math.pow(1 + i, nTargetMeses);
    const initialGrowth = valorInicial * compoundFactor;

    if (initialGrowth >= metaValor) {
      modoBSucesso = true;
      modoBAporteMensal = 0;
      modoBMensagem = `O valor inicial de ${formatBRL(valorInicial)} sozinho ultrapassa a meta de ${formatBRL(metaValor)} em ${periodoAnosTarget} anos sem necessidade de novos aportes.`;
    } else {
      const remainingNeeded = metaValor - initialGrowth;
      let pmtNeeded = 0;

      if (i <= 0) {
        pmtNeeded = remainingNeeded / nTargetMeses;
      } else {
        const pmtFactor = (compoundFactor - 1) / i;
        pmtNeeded = remainingNeeded / pmtFactor;
      }

      if (isFinite(pmtNeeded) && pmtNeeded >= 0) {
        modoBSucesso = true;
        modoBAporteMensal = pmtNeeded;
        modoBMensagem = `Para atingir ${formatBRL(metaValor)} em ${periodoAnosTarget} anos (${nTargetMeses} meses), você precisa aportar aproximadamente ${formatBRL(pmtNeeded)} por mês.`;
      } else {
        modoBSucesso = false;
        modoBMensagem = 'Não foi possível calcular o aporte necessário para os parâmetros informados.';
      }
    }
  }

  return {
    metaValor,
    modoATempoMeses,
    modoATempoAnos: Math.ceil(modoATempoMeses / 12),
    modoASucesso,
    modoAMensagem,
    modoBAporteMensal,
    modoBSucesso,
    modoBMensagem,
  };
}

/**
 * Opções Rápidas "E se você mudar algumas coisas?"
 */
export function getWhatIfOptions(baseParams: JurosCompostosParams): WhatIfOption[] {
  const baseResult = calculateJurosCompostos(baseParams);

  const currentValorInicial = parseBrazilianNumber(baseParams.valorInicial);
  const currentAporte = parseBrazilianNumber(baseParams.aporteMensal);
  const currentPeriodo = parseBrazilianNumber(baseParams.periodo);
  const currentTaxa = parseBrazilianNumber(baseParams.taxaJuros);

  // 1. + R$ 100 por mês
  const params100: JurosCompostosParams = {
    ...baseParams,
    aporteMensal: currentAporte + 100,
  };
  const res100 = calculateJurosCompostos(params100);

  // 2. + 5 anos (ou + 12 meses)
  const isAnos = baseParams.tipoPeriodo === 'anos';
  const paramsTime: JurosCompostosParams = {
    ...baseParams,
    periodo: isAnos ? currentPeriodo + 5 : currentPeriodo + 60,
  };
  const resTime = calculateJurosCompostos(paramsTime);

  // 3. Taxa + 0.5%
  const paramsRate: JurosCompostosParams = {
    ...baseParams,
    taxaJuros: currentTaxa + 0.5,
  };
  const resRate = calculateJurosCompostos(paramsRate);

  return [
    {
      id: 'more_100',
      label: '+ R$ 100 / mês',
      diffAmount: res100.totalFinal - baseResult.totalFinal,
      newTotalFinal: res100.totalFinal,
      params: params100,
    },
    {
      id: 'more_time',
      label: isAnos ? '+ 5 Anos de prazo' : '+ 60 Meses de prazo',
      diffAmount: resTime.totalFinal - baseResult.totalFinal,
      newTotalFinal: resTime.totalFinal,
      params: paramsTime,
    },
    {
      id: 'more_rate',
      label: '+ 0.5% na Taxa de Juros',
      diffAmount: resRate.totalFinal - baseResult.totalFinal,
      newTotalFinal: resRate.totalFinal,
      params: paramsRate,
    },
  ];
}

/**
 * Serialização segura dos parâmetros para URL de Compartilhamento
 */
export function serializeParamsToURL(params: JurosCompostosParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set('vi', String(parseBrazilianNumber(params.valorInicial)));
  searchParams.set('am', String(parseBrazilianNumber(params.aporteMensal)));
  searchParams.set('tj', String(parseBrazilianNumber(params.taxaJuros)));
  searchParams.set('tt', params.tipoTaxa);
  searchParams.set('p', String(parseBrazilianNumber(params.periodo)));
  searchParams.set('tp', params.tipoPeriodo);
  return searchParams.toString();
}

/**
 * Deserialização e sanitização segura de parâmetros da URL
 */
export function parseParamsFromURL(searchParams: Record<string, string | string[] | undefined>): JurosCompostosParams | null {
  if (!searchParams || Object.keys(searchParams).length === 0) return null;

  const viRaw = Array.isArray(searchParams.vi) ? searchParams.vi[0] : searchParams.vi;
  const amRaw = Array.isArray(searchParams.am) ? searchParams.am[0] : searchParams.am;
  const tjRaw = Array.isArray(searchParams.tj) ? searchParams.tj[0] : searchParams.tj;
  const ttRaw = Array.isArray(searchParams.tt) ? searchParams.tt[0] : searchParams.tt;
  const pRaw = Array.isArray(searchParams.p) ? searchParams.p[0] : searchParams.p;
  const tpRaw = Array.isArray(searchParams.tp) ? searchParams.tp[0] : searchParams.tp;

  if (!viRaw && !amRaw && !tjRaw && !pRaw) return null;

  const valorInicial = Math.min(1000000000, Math.max(0, parseBrazilianNumber(viRaw)));
  const aporteMensal = Math.min(100000000, Math.max(0, parseBrazilianNumber(amRaw)));
  const taxaJuros = Math.min(500, Math.max(0, parseBrazilianNumber(tjRaw)));
  const periodo = Math.min(600, Math.max(1, parseBrazilianNumber(pRaw || 1)));
  const tipoTaxa = ttRaw === 'anual' ? 'anual' : 'mensal';
  const tipoPeriodo = tpRaw === 'meses' ? 'meses' : 'anos';

  return {
    valorInicial,
    aporteMensal,
    taxaJuros,
    tipoTaxa,
    periodo,
    tipoPeriodo,
  };
}
