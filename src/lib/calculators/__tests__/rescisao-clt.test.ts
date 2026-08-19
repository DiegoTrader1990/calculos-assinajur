import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateRescisao,
  calculateDiasAvisoPrevio,
  calculateAvosDecimoTerceiro,
  calculateAvosFeriasProporcionais,
  calculateAnosCompletos,
  calculateInss,
  calculateIrrf,
  compareModalidades,
  parseBrazilianNumber,
  formatBRL
} from '../rescisao-clt';

describe('Calculadora de Rescisão Trabalhista CLT - Testes Jurídicos & Matemáticos', () => {

  it('1. Demissão sem justa causa com 3 anos completos de serviço (Aviso indenizado de 39 dias)', () => {
    const res = calculateRescisao({
      salarioBase: 4000,
      mediasAdicionais: 500, // Remuneração base = R$ 4.500,00
      dataAdmissao: '2023-03-10',
      dataDemissao: '2026-08-20',
      modalidade: 'sem_justa_causa',
      tipoAviso: 'indenizado',
      possuiFeriasVencidas: true,
      feriasVencidasEmDobro: false,
      saldoFgtsExtrato: 12000,
      dependentesIrrf: 1,
    });

    // 3 anos completos -> 30 + 9 = 39 dias de aviso prévio
    assert.strictEqual(res.anosCompletos, 3);
    assert.strictEqual(res.diasAvisoPrevio, 39);
    
    // Projeção do aviso prévio: 20/08/2026 + 39 dias = 28/09/2026 (9 avos de 13º)
    assert.strictEqual(res.avosDecimoTerceiro, 9);
    assert.strictEqual(res.avosFeriasProporcionais, 7);

    // Multa de 40% do FGTS
    assert.strictEqual(res.fgtsPercentualMulta, 40);
    assert.ok(res.fgtsValorMulta > 0);
    assert.ok(res.fgtsValorSaquePermitido > 12000);
    assert.strictEqual(res.direitoSeguroDesemprego, true);
  });

  it('2. Pedido de demissão com aviso não cumprido (Desconto de 30 dias)', () => {
    const res = calculateRescisao({
      salarioBase: 3000,
      dataAdmissao: '2025-02-01',
      dataDemissao: '2025-07-15',
      modalidade: 'pedido_demissao',
      tipoAviso: 'nao_cumprido',
      possuiFeriasVencidas: false,
      saldoFgtsExtrato: 1200,
    });

    // Deve descontar 30 dias de salário
    const descontoAviso = res.verbas.find(v => v.id === 'desconto_aviso_previo');
    assert.ok(descontoAviso);
    assert.strictEqual(descontoAviso?.desconto, 3000);

    // No pedido de demissão, FGTS fica retido sem saque e sem multa
    assert.strictEqual(res.fgtsPercentualMulta, 0);
    assert.strictEqual(res.fgtsValorSaquePermitido, 0);
    assert.strictEqual(res.direitoSeguroDesemprego, false);
  });

  it('3. Rescisão por Acordo Mútuo - Art. 484-A CLT (Aviso 50%, Multa 20%, Saque 80%)', () => {
    const res = calculateRescisao({
      salarioBase: 5000,
      dataAdmissao: '2024-06-30',
      dataDemissao: '2026-06-30',
      modalidade: 'acordo_mutuo',
      tipoAviso: 'indenizado',
      saldoFgtsExtrato: 10000,
    });

    // 2 anos completos -> 36 dias de aviso (50% pago = 18 dias)
    assert.strictEqual(res.diasAvisoPrevio, 36);
    const itemAviso = res.verbas.find(v => v.id === 'aviso_previo_acordo');
    assert.ok(itemAviso);
    assert.strictEqual(itemAviso?.provento, 3000); // 50% de R$ 6.000 (36 dias)

    // Multa de 20% do FGTS
    assert.strictEqual(res.fgtsPercentualMulta, 20);
    assert.ok(res.fgtsValorSaquePermitido > 0);
    assert.ok(res.fgtsRetidoNaCaixa > 0);
    assert.strictEqual(res.direitoSeguroDesemprego, false);
  });

  it('4. Término normal de contrato por prazo determinado / experiência', () => {
    const res = calculateRescisao({
      salarioBase: 2500,
      dataAdmissao: '2026-01-15',
      dataDemissao: '2026-04-15',
      modalidade: 'termino_contrato',
      tipoAviso: 'dispensado',
      saldoFgtsExtrato: 600,
    });

    assert.strictEqual(res.diasAvisoPrevio, 0);
    assert.strictEqual(res.fgtsPercentualMulta, 0);
    assert.ok(res.fgtsValorSaquePermitido >= 600); // Saque 100% liberado sem multa
  });

  it('5. Cálculo da Lei 12.506/2011 (Proporcionalidade do aviso prévio)', () => {
    assert.strictEqual(calculateDiasAvisoPrevio(0, 'sem_justa_causa'), 30);
    assert.strictEqual(calculateDiasAvisoPrevio(1, 'sem_justa_causa'), 33);
    assert.strictEqual(calculateDiasAvisoPrevio(2, 'sem_justa_causa'), 36);
    assert.strictEqual(calculateDiasAvisoPrevio(10, 'sem_justa_causa'), 60);
    assert.strictEqual(calculateDiasAvisoPrevio(20, 'sem_justa_causa'), 90);
    assert.strictEqual(calculateDiasAvisoPrevio(25, 'sem_justa_causa'), 90); // Teto de 90 dias

    // Pedido de demissão: fixo 30 dias a favor do empregador
    assert.strictEqual(calculateDiasAvisoPrevio(5, 'pedido_demissao'), 30);
  });

  it('6. Regra dos 15 dias no mês para contagem de avos do 13º Salário', () => {
    // Admissão 01/01, Demissão 14/03 (14 dias em março < 15) -> 2 avos
    assert.strictEqual(calculateAvosDecimoTerceiro('2026-01-01', '2026-03-14'), 2);

    // Admissão 01/01, Demissão 15/03 (15 dias em março >= 15) -> 3 avos
    assert.strictEqual(calculateAvosDecimoTerceiro('2026-01-01', '2026-03-15'), 3);
  });

  it('7. Férias Vencidas em Dobro (Art. 137 CLT)', () => {
    const res = calculateRescisao({
      salarioBase: 3000,
      dataAdmissao: '2023-01-01',
      dataDemissao: '2026-01-01',
      modalidade: 'sem_justa_causa',
      tipoAviso: 'indenizado',
      possuiFeriasVencidas: true,
      feriasVencidasEmDobro: true,
    });

    const itemFeriasDobro = res.verbas.find(v => v.id === 'ferias_vencidas');
    assert.ok(itemFeriasDobro);
    // 3000 * 2 (dobro) + 1/3 = 6000 + 2000 = 8000
    assert.strictEqual(itemFeriasDobro?.provento, 8000);
  });

  it('8. Teste Tabela INSS 2026 (Teto R$ 988,09)', () => {
    assert.strictEqual(calculateInss(1000), 75); // 7.5% de 1000
    assert.strictEqual(calculateInss(10000), 988.09); // Teto de 2026
  });

  it('9. Teste Isenção de IRRF 2026 (Lei 15.270/2025 para valores <= R$ 5.000)', () => {
    assert.strictEqual(calculateIrrf(4500, 400, 0), 0);
  });

  it('10. Simulação Comparativa de Modalidades', () => {
    const input = {
      salarioBase: 4000,
      dataAdmissao: '2024-01-01',
      dataDemissao: '2026-01-01',
      modalidade: 'sem_justa_causa' as const,
      tipoAviso: 'indenizado' as const,
      saldoFgtsExtrato: 8000,
    };

    const comp = compareModalidades(input);
    assert.strictEqual(comp.length, 4);
    
    // Sem justa causa deve ter o maior total geral devido à multa de 40% e saque integral
    const semJusta = comp.find(c => c.modalidade === 'sem_justa_causa');
    const pedido = comp.find(c => c.modalidade === 'pedido_demissao');
    assert.ok(semJusta && pedido);
    assert.ok(semJusta.totalGeral > pedido.totalGeral);
  });

  it('11. Parse de formato numérico brasileiro', () => {
    assert.strictEqual(parseBrazilianNumber('4.500,00'), 4500);
    assert.strictEqual(parseBrazilianNumber('1250,5'), 1250.5);
    assert.strictEqual(parseBrazilianNumber(3500), 3500);
    assert.strictEqual(parseBrazilianNumber(''), 0);
  });

});
