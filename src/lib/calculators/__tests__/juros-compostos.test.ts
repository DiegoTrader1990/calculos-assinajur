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
  parseParamsFromURL
} from '../juros-compostos';

describe('Calculadora de Juros Compostos - Testes Matemáticos & Solvers Expandidos', () => {

  it('Caso 1: Sem aporte e sem juros (P=1000, PMT=0, i=0%, n=12 meses)', () => {
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

  it('Caso 2: Sem aporte, com juros (P=1000, PMT=0, i=1% a.m., n=12 meses)', () => {
    const res = calculateJurosCompostos({
      valorInicial: 1000,
      aporteMensal: 0,
      taxaJuros: 1,
      tipoTaxa: 'mensal',
      periodo: 12,
      tipoPeriodo: 'meses',
    });

    const expectedFinal = 1000 * Math.pow(1.01, 12);
    assert.ok(Math.abs(res.totalFinal - expectedFinal) < 0.01);
    assert.strictEqual(res.totalInvested, 1000);
  });

  it('Caso 3: Com aporte mensal postcipado (P=1000, PMT=300, i=1% a.m., n=60 meses)', () => {
    const res = calculateJurosCompostos({
      valorInicial: 1000,
      aporteMensal: 300,
      taxaJuros: 1,
      tipoTaxa: 'mensal',
      periodo: 5,
      tipoPeriodo: 'anos',
    });

    const expectedInvested = 1000 + 300 * 60; // 19000
    assert.strictEqual(res.totalInvested, expectedInvested);
    assert.ok(Math.abs(res.totalFinal - 26317.60) < 1.0);
    assert.ok(res.totalInterest > 7000);
  });

  it('Caso 4: Taxa de juros zero com aportes (P=1000, PMT=300, i=0%, n=10 meses)', () => {
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

  it('Caso 5: Equivalência composta de taxas (1% a.m. <-> 12.6825% a.a.)', () => {
    const taxaAnual = convertRate(1, 'mensal', 'anual');
    assert.ok(Math.abs(taxaAnual - 12.6825) < 0.001);

    const taxaMensal = convertRate(12.682503, 'anual', 'mensal');
    assert.ok(Math.abs(taxaMensal - 1) < 0.001);
  });

  it('Caso 6: Parseamento seguro de formato de número brasileiro', () => {
    assert.strictEqual(parseBrazilianNumber('1.000,50'), 1000.5);
    assert.strictEqual(parseBrazilianNumber('10000,75'), 10000.75);
    assert.strictEqual(parseBrazilianNumber('10,5'), 10.5);
    assert.strictEqual(parseBrazilianNumber('0,8'), 0.8);
    assert.strictEqual(parseBrazilianNumber(''), 0);
  });

  it('Caso 7: Comparação de Cenários (Cenário A vs Cenário B)', () => {
    const paramsA = { valorInicial: 1000, aporteMensal: 300, taxaJuros: 1, tipoTaxa: 'mensal' as const, periodo: 5, tipoPeriodo: 'anos' as const };
    const paramsB = { valorInicial: 1000, aporteMensal: 500, taxaJuros: 1, tipoTaxa: 'mensal' as const, periodo: 5, tipoPeriodo: 'anos' as const };

    const comp = compareScenarios(paramsA, paramsB);

    assert.strictEqual(comp.winner, 'B');
    assert.ok(comp.diffFinal > 0);
    assert.ok(comp.summaryText.includes('Cenário B gera'));
  });

  it('Caso 8: Solver de Metas Financeiras (Modo A e Modo B)', () => {
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

  it('Caso 9: Opções de "E se você mudar algumas coisas?" (What-Ifs)', () => {
    const params = { valorInicial: 1000, aporteMensal: 300, taxaJuros: 1, tipoTaxa: 'mensal' as const, periodo: 5, tipoPeriodo: 'anos' as const };
    const options = getWhatIfOptions(params);

    assert.strictEqual(options.length, 3);
    assert.ok(options[0].diffAmount > 0);
  });

  it('Caso 10: Serialização e Sanitização de Parâmetros na URL', () => {
    const params = {
      valorInicial: 1000,
      aporteMensal: 300,
      taxaJuros: 1,
      tipoTaxa: 'mensal' as const,
      periodo: 5,
      tipoPeriodo: 'anos' as const,
    };

    const queryString = serializeParamsToURL(params);
    assert.ok(queryString.includes('vi=1000'));
    assert.ok(queryString.includes('am=300'));

    const parsed = parseParamsFromURL({ vi: '1000', am: '300', tj: '1', tt: 'mensal', p: '5', tp: 'anos' });
    assert.strictEqual(parsed?.valorInicial, 1000);
    assert.strictEqual(parsed?.aporteMensal, 300);
  });

});
