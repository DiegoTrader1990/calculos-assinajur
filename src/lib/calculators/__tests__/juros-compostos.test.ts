import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateJurosCompostos,
  convertRate,
  parseBrazilianNumber,
  compareScenarios,
  solveFinancialGoal,
  getWhatIfOptions,
  serializeParamsToURL,
  parseParamsFromURL,
  formatBRL
} from '../juros-compostos';

describe('Calculadora de Juros Compostos - Testes Matemáticos & Auditoria da Engine Central', () => {

  it('Caso Específico Exemplo 2: R$ 5.000, sem aportes, 0,8% a.m. por 120 meses -> R$ 13.008,70', () => {
    const res = calculateJurosCompostos({
      valorInicial: 5000,
      aporteMensal: 0,
      taxaJuros: 0.8,
      tipoTaxa: 'mensal',
      periodo: 120,
      tipoPeriodo: 'meses',
    });

    // 5000 * (1.008)^120 = 13008.70025...
    const expectedFinal = 5000 * Math.pow(1.008, 120);
    assert.ok(Math.abs(res.totalFinal - expectedFinal) < 0.001);
    assert.strictEqual(res.totalFinal.toFixed(2), '13008.70');
    assert.strictEqual(res.totalInvested.toFixed(2), '5000.00');
    assert.strictEqual(res.totalInterest.toFixed(2), '8008.70');
    assert.ok(formatBRL(res.totalFinal).includes('13.008,70'));
  });

  it('Caso Específico Exemplo 1: R$ 1.000 inicial, R$ 300/mês, 1% a.m. por 5 anos (60 meses)', () => {
    const res = calculateJurosCompostos({
      valorInicial: 1000,
      aporteMensal: 300,
      taxaJuros: 1,
      tipoTaxa: 'mensal',
      periodo: 5,
      tipoPeriodo: 'anos',
    });

    assert.strictEqual(res.totalInvested, 19000);
    assert.strictEqual(res.totalInvested.toFixed(2), '19000.00');
    assert.ok(Math.abs(res.totalFinal - 26317.60) < 0.5);
    assert.ok(formatBRL(res.totalInvested).includes('19.000,00'));
  });

  it('Caso: Sem aporte e sem juros (P=1000, PMT=0, i=0%, n=12 meses)', () => {
    const res = calculateJurosCompostos({
      valorInicial: 1000,
      aporteMensal: 0,
      taxaJuros: 0,
      tipoTaxa: 'mensal',
      periodo: 12,
      tipoPeriodo: 'meses',
    });

    assert.strictEqual(res.totalInvested, 1000);
    assert.strictEqual(res.totalInterest, 0);
    assert.strictEqual(res.totalFinal, 1000);
  });

  it('Caso: Valor inicial zero com aportes mensais (P=0, PMT=200, i=1% a.m., n=12 meses)', () => {
    const res = calculateJurosCompostos({
      valorInicial: 0,
      aporteMensal: 200,
      taxaJuros: 1,
      tipoTaxa: 'mensal',
      periodo: 12,
      tipoPeriodo: 'meses',
    });

    assert.strictEqual(res.totalInvested, 2400);
    assert.ok(res.totalInterest > 0);
    assert.ok(res.totalFinal > 2400);
  });

  it('Caso: Taxa zero com aportes (P=1000, PMT=300, i=0%, n=10 meses)', () => {
    const res = calculateJurosCompostos({
      valorInicial: 1000,
      aporteMensal: 300,
      taxaJuros: 0,
      tipoTaxa: 'mensal',
      periodo: 10,
      tipoPeriodo: 'meses',
    });

    assert.strictEqual(res.totalInvested, 4000);
    assert.strictEqual(res.totalInterest, 0);
    assert.strictEqual(res.totalFinal, 4000);
  });

  it('Caso: Taxa Anual Equivalente Composta (1% a.m. <-> 12.6825% a.a.)', () => {
    const taxaAnual = convertRate(1, 'mensal', 'anual');
    assert.ok(Math.abs(taxaAnual - 12.6825) < 0.001);

    const taxaMensal = convertRate(12.682503, 'anual', 'mensal');
    assert.ok(Math.abs(taxaMensal - 1) < 0.001);
  });

  it('Caso: Formato numérico brasileiro com vírgula e ponto', () => {
    assert.strictEqual(parseBrazilianNumber('1.000,50'), 1000.5);
    assert.strictEqual(parseBrazilianNumber('10000,75'), 10000.75);
    assert.strictEqual(parseBrazilianNumber('10,5'), 10.5);
    assert.strictEqual(parseBrazilianNumber('0,8'), 0.8);
    assert.strictEqual(parseBrazilianNumber(''), 0);
  });

  it('Caso: Comparação de Cenários (A x B)', () => {
    const paramsA = { valorInicial: 1000, aporteMensal: 300, taxaJuros: 1, tipoTaxa: 'mensal' as const, periodo: 5, tipoPeriodo: 'anos' as const };
    const paramsB = { valorInicial: 1000, aporteMensal: 500, taxaJuros: 1, tipoTaxa: 'mensal' as const, periodo: 5, tipoPeriodo: 'anos' as const };

    const comp = compareScenarios(paramsA, paramsB);
    assert.strictEqual(comp.winner, 'B');
    assert.ok(comp.diffFinal > 0);
  });

  it('Caso: Solver de Metas Financeiras (Modo A e Modo B)', () => {
    const goalRes = solveFinancialGoal({
      metaValor: 100000,
      valorInicial: 1000,
      aporteMensal: 500,
      taxaJuros: 1,
      tipoTaxa: 'mensal',
      periodoAnos: 10,
    });

    assert.strictEqual(goalRes.modoASucesso, true);
    assert.ok(goalRes.modoATempoMeses > 0);
    assert.strictEqual(goalRes.modoBSucesso, true);
    assert.ok(goalRes.modoBAporteMensal > 0);
  });

  it('Caso: Gerador de "E se...?" (What-Ifs)', () => {
    const params = { valorInicial: 1000, aporteMensal: 300, taxaJuros: 1, tipoTaxa: 'mensal' as const, periodo: 5, tipoPeriodo: 'anos' as const };
    const options = getWhatIfOptions(params);

    assert.strictEqual(options.length, 3);
    assert.ok(options[0].diffAmount > 0);
  });

  it('Caso: Serialização de Parâmetros de URL', () => {
    const params = {
      valorInicial: 1000,
      aporteMensal: 300,
      taxaJuros: 1,
      tipoTaxa: 'mensal' as const,
      periodo: 5,
      tipoPeriodo: 'anos' as const,
    };

    const queryString = serializeParamsToURL(params);
    const parsed = parseParamsFromURL({ vi: '1000', am: '300', tj: '1', tt: 'mensal', p: '5', tp: 'anos' });

    assert.strictEqual(parsed?.valorInicial, 1000);
    assert.strictEqual(parsed?.aporteMensal, 300);
  });

});
