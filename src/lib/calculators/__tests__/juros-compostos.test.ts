import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateJurosCompostos,
  convertRate,
  parseBrazilianNumber,
  formatBRL,
  formatPercent
} from '../juros-compostos';

describe('Calculadora de Juros Compostos - Testes Matemáticos & Formatação', () => {

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

    const expectedFinal = 1000 * Math.pow(1.01, 12); // 1126.82503...
    assert.ok(Math.abs(res.totalFinal - expectedFinal) < 0.01);
    assert.strictEqual(res.totalInvested, 1000);
    assert.ok(Math.abs(res.totalInterest - (expectedFinal - 1000)) < 0.01);
  });

  it('Caso 3: Com aporte mensal e juros ao fim do período (P=1000, PMT=300, i=1% a.m., n=60 meses)', () => {
    const res = calculateJurosCompostos({
      valorInicial: 1000,
      aporteMensal: 300,
      taxaJuros: 1,
      tipoTaxa: 'mensal',
      periodo: 5,
      tipoPeriodo: 'anos',
    });

    // P_final = 1000 * (1.01^60) = 1816.6967
    // PMT_final = 300 * ((1.01^60 - 1) / 0.01) = 24500.901
    // Total final = 1816.6967 + 24500.901 = 26317.5977...
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

  it('Caso 5: Conversão de taxas por equivalência composta (1% a.m. <-> 12.6825% a.a.)', () => {
    const taxaAnual = convertRate(1, 'mensal', 'anual');
    // (1.01^12 - 1) * 100 = 12.682503...
    assert.ok(Math.abs(taxaAnual - 12.6825) < 0.001);

    const taxaMensal = convertRate(12.682503, 'anual', 'mensal');
    assert.ok(Math.abs(taxaMensal - 1) < 0.001);
  });

  it('Caso 6: Parseamento de números no formato brasileiro com vírgula', () => {
    assert.strictEqual(parseBrazilianNumber('1.000,50'), 1000.5);
    assert.strictEqual(parseBrazilianNumber('10000,75'), 10000.75);
    assert.strictEqual(parseBrazilianNumber('10,5'), 10.5);
    assert.strictEqual(parseBrazilianNumber('0,8'), 0.8);
    assert.strictEqual(parseBrazilianNumber(''), 0);
    assert.strictEqual(parseBrazilianNumber(null), 0);
    assert.strictEqual(parseBrazilianNumber('abc'), 0);
  });

  it('Caso 7: Equivalência de período entre meses e anos (5 anos = 60 meses)', () => {
    const resAnos = calculateJurosCompostos({
      valorInicial: 5000,
      aporteMensal: 200,
      taxaJuros: 0.8,
      tipoTaxa: 'mensal',
      periodo: 5,
      tipoPeriodo: 'anos',
    });

    const resMeses = calculateJurosCompostos({
      valorInicial: 5000,
      aporteMensal: 200,
      taxaJuros: 0.8,
      tipoTaxa: 'mensal',
      periodo: 60,
      tipoPeriodo: 'meses',
    });

    assert.strictEqual(resAnos.totalMeses, resMeses.totalMeses);
    assert.strictEqual(resAnos.totalInvested, resMeses.totalInvested);
    assert.strictEqual(resAnos.totalFinal.toFixed(2), resMeses.totalFinal.toFixed(2));
  });

  it('Caso 8: Limites de validação e prevenção de NaN/Infinity', () => {
    const resNegative = calculateJurosCompostos({
      valorInicial: -500,
      aporteMensal: -100,
      taxaJuros: -5,
      tipoTaxa: 'mensal',
      periodo: -10,
      tipoPeriodo: 'meses',
    });

    assert.ok(!isNaN(resNegative.totalFinal));
    assert.ok(isFinite(resNegative.totalFinal));
    assert.strictEqual(resNegative.totalInvested, 0);

    const resExcessive = calculateJurosCompostos({
      valorInicial: 1000,
      aporteMensal: 100,
      taxaJuros: 1,
      tipoTaxa: 'mensal',
      periodo: 100, // > 50 anos
      tipoPeriodo: 'anos',
    });

    assert.strictEqual(resExcessive.isValid, false);
    assert.ok(resExcessive.errors.periodo !== undefined);
  });

});
