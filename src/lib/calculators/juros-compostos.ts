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
  breakdown: MonthlyBreakdown[];
  yearlyBreakdown: MonthlyBreakdown[];
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Normaliza e converte strings no formato brasileiro (ex: "1.000,50" ou "10,5")
 * para número seguro de JS. Retorna 0 se inválido.
 */
export function parseBrazilianNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0;
  if (typeof value === 'number') return isNaN(value) || !isFinite(value) ? 0 : value;

  const str = String(value).trim();
  if (!str) return 0;

  // Se já for formato numérico JS puro "1000.5"
  if (/^-?\d+(\.\d+)?$/.test(str)) {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  }

  // Substitui pontos de milhar e vírgula decimal
  // ex: "1.250,75" -> "1250.75"
  const cleanStr = str
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
}

/**
 * Formata um número para Moeda Brasileira R$ 1.000,00
 */
export function formatBRL(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Formata um percentual para o padrão brasileiro 1,25%
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0,00%';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + '%';
}

/**
 * Converte taxa entre anual e mensal usando equivalência composta
 */
export function convertRate(ratePercent: number, from: 'mensal' | 'anual', to: 'mensal' | 'anual'): number {
  if (ratePercent <= 0) return 0;
  
  if (from === to) return ratePercent;

  if (from === 'anual' && to === 'mensal') {
    // i_mensal = (1 + i_anual)^(1/12) - 1
    const iAnual = ratePercent / 100;
    const iMensal = Math.pow(1 + iAnual, 1 / 12) - 1;
    return iMensal * 100;
  }

  if (from === 'mensal' && to === 'anual') {
    // i_anual = (1 + i_mensal)^12 - 1
    const iMensal = ratePercent / 100;
    const iAnual = Math.pow(1 + iMensal, 12) - 1;
    return iAnual * 100;
  }

  return ratePercent;
}

/**
 * Executa o cálculo exato de Juros Compostos com Aportes no Fim do Período
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
    errors.taxaJuros = 'A taxa de juros informada excede o limite praticável (500%).';
  }

  const isValid = Object.keys(errors).length === 0;

  const totalMeses = Math.min(
    600,
    Math.max(1, Math.round(params.tipoPeriodo === 'anos' ? periodoInput * 12 : periodoInput))
  );

  // Taxa de juros mensal decimal
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
    // 1. Juros renderam sobre o saldo acumulado até o mês anterior
    const interestForMonth = currentBalance * i;
    accumulatedInterest += interestForMonth;
    currentBalance += interestForMonth;

    // 2. Aporte mensal é realizado ao FINAL do período
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

  if (totalFinal > 0) {
    percentInvested = Math.min(100, Math.max(0, (totalInvested / totalFinal) * 100));
    percentInterest = Math.min(100, Math.max(0, (totalInterest / totalFinal) * 100));
  }

  // Agrupamento anual para resumo na tabela
  const yearlyBreakdown = breakdown.filter(
    (b) => b.monthInYear === 12 || b.month === totalMeses
  );

  return {
    totalMeses,
    taxaMensalEfetiva: taxaMensalPercent,
    taxaAnualEquivalente,
    totalInvested,
    totalInterest,
    totalFinal,
    percentInvested,
    percentInterest,
    breakdown,
    yearlyBreakdown,
    isValid,
    errors,
  };
}
