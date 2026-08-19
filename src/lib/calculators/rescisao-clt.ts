/**
 * ENGINE MATEMÁTICA E JURÍDICA DE RESCISÃO TRABALHISTA (CLT 2026)
 * 
 * Fontes Normativas:
 * - Consolidação das Leis do Trabalho (CLT) - Decreto-Lei nº 5.452/1943
 * - Lei nº 12.506/2011 (Aviso prévio proporcional de 30 a 90 dias)
 * - Lei nº 13.467/2017 - Reforma Trabalhista (Art. 484-A - Acordo Mútuo)
 * - Lei nº 4.090/1962 e Decreto nº 10.854/2021 (13º Salário)
 * - Súmulas TST: 171, 261, 305, 328, 347 e OJ 82 SDI-1
 * - Tabela INSS 2026 (Portaria MPS/MF nº 6/2025 c/c salário mínimo R$ 1.621,00)
 * - Lei nº 15.270/2025 (Redutor e Isenção de IRRF até R$ 5.000,00 em 2026)
 */

export type ModalidadeRescisao =
  | 'sem_justa_causa'      // Dispensa sem justa causa
  | 'pedido_demissao'      // Pedido de demissão
  | 'acordo_mutuo'         // Rescisão por acordo (Art. 484-A)
  | 'termino_contrato';    // Término normal de contrato por prazo determinado

export type TipoAvisoPrevio = 'indenizado' | 'trabalhado' | 'nao_cumprido' | 'dispensado';

export interface RescisaoInput {
  salarioBase: number;
  dataAdmissao: string;     // ISO format YYYY-MM-DD
  dataDemissao: string;     // ISO format YYYY-MM-DD
  modalidade: ModalidadeRescisao;
  tipoAviso: TipoAvisoPrevio;
  saldoFgtsExtrato?: number;
  possuiFeriasVencidas?: boolean;
  feriasVencidasEmDobro?: boolean;
  dependentesIrrf?: number;
  mediasAdicionais?: number; // Horas extras, comissões, adicionais habituais
}

export interface VerbaItem {
  id: string;
  descricao: string;
  referencia: string; // Ex: "20 dias", "9/12 avos", "39 dias"
  provento: number;
  desconto: number;
  tipo: 'trct_provento' | 'trct_desconto' | 'fgts_caixa';
  fundamentoLegal: string;
}

export interface RescisaoResult {
  salarioBase: number;
  remuneracaoBase: number;
  dataAdmissao: string;
  dataDemissao: string;
  modalidade: ModalidadeRescisao;
  modalidadeNome: string;
  modalidadeDescricao: string;
  
  anosCompletos: number;
  diasAvisoPrevio: number;
  dataProjecaoAviso: string;
  avosDecimoTerceiro: number;
  avosFeriasProporcionais: number;
  
  verbas: VerbaItem[];
  
  // Totais organizados por fonte pagadora
  totalProventosTrct: number;
  totalDescontosTrct: number;
  liquidoTrct: number;               // Pago pelo empregador
  
  // FGTS e Multa (Caixa Econômica Federal)
  fgtsDepositosRescisorios: number;
  fgtsBaseMulta: number;
  fgtsPercentualMulta: number;       // 40%, 20% ou 0%
  fgtsValorMulta: number;
  fgtsValorSaquePermitido: number;   // 100% ou 80% do saldo + multa
  fgtsRetidoNaCaixa: number;
  fgtsCodigoSaque: string;
  
  // Total Geral Estimado
  totalGeralEstimado: number;        // liquidoTrct + fgtsValorSaquePermitido
  direitoSeguroDesemprego: boolean;
  prazoPagamentoDias: number;
  
  // Detalhamento de impostos
  inssSalario: number;
  inssDecimoTerceiro: number;
  totalInss: number;
  irrfTotal: number;
  
  // Resumo gerado programaticamente
  resumoTextual: string;
}

export interface ComparacaoModalidade {
  modalidade: ModalidadeRescisao;
  nome: string;
  liquidoTrct: number;
  fgtsSaque: number;
  totalGeral: number;
  diferencaParaAtual: number;
}

/**
 * Trata entrada numérica no padrão brasileiro (ex: "2.500,50" -> 2500.5)
 */
export function parseBrazilianNumber(val: string | number | undefined | null): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return isNaN(val) || !isFinite(val) ? 0 : val;

  const str = String(val).trim();
  if (!str) return 0;

  // Se já for numérico direto "2500.50"
  if (/^-?\d+(\.\d+)?$/.test(str)) {
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Padrão BR: remove pontos de milhar e substitui vírgula decimal por ponto
  const cleanStr = str.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formata valor monetário em R$ pt-BR com 2 casas decimais e arredondamento seguro
 */
export function formatBRL(val: number): string {
  const safeVal = Math.round((val + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeVal);
}

/**
 * Arredonda valor para 2 casas decimais sem imprecisão de ponto flutuante
 */
function roundCurrency(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Adiciona dias a uma data no formato YYYY-MM-DD
 */
function addDaysToDate(dateStr: string, days: number): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Calcula a diferença em anos completos entre duas datas
 */
export function calculateAnosCompletos(admissaoStr: string, demissaoStr: string): number {
  const admParts = admissaoStr.split('-').map(Number);
  const demParts = demissaoStr.split('-').map(Number);
  if (admParts.length !== 3 || demParts.length !== 3) return 0;

  const adm = new Date(admParts[0], admParts[1] - 1, admParts[2]);
  const dem = new Date(demParts[0], demParts[1] - 1, demParts[2]);
  if (dem < adm) return 0;

  let years = dem.getFullYear() - adm.getFullYear();
  const mDiff = dem.getMonth() - adm.getMonth();
  if (mDiff < 0 || (mDiff === 0 && dem.getDate() < adm.getDate())) {
    years--;
  }
  return Math.max(0, years);
}

/**
 * Calcula os dias de aviso prévio proporcional conforme Lei 12.506/2011
 */
export function calculateDiasAvisoPrevio(anosCompletos: number, modalidade: ModalidadeRescisao): number {
  if (modalidade === 'termino_contrato') return 0;
  if (modalidade === 'pedido_demissao') return 30; // Nota Técnica MTE nº 01/2012: 3 dias/ano aplica-se apenas em favor do empregado
  return Math.min(30 + anosCompletos * 3, 90);
}

/**
 * Calcula os avos do 13º salário proporcional com regra dos 15 dias no mês
 */
export function calculateAvosDecimoTerceiro(dataAdmissaoStr: string, dataProjecaoStr: string): number {
  const demParts = dataProjecaoStr.split('-').map(Number);
  const admParts = dataAdmissaoStr.split('-').map(Number);
  if (demParts.length !== 3 || admParts.length !== 3) return 0;

  const anoCorrente = demParts[0];
  const mesFinal = demParts[1];
  const diaFinal = demParts[2];

  const anoAdm = admParts[0];
  const mesAdm = admParts[1];
  const diaAdm = admParts[2];

  let avos = 0;
  const mesInicial = anoAdm === anoCorrente ? mesAdm : 1;

  for (let m = mesInicial; m <= mesFinal; m++) {
    if (m === mesAdm && anoAdm === anoCorrente) {
      // Primeiro mês trabalhado no ano de admissão
      const ultDiaMes = new Date(anoCorrente, m, 0).getDate();
      const diasTrabalhadosMes = ultDiaMes - diaAdm + 1;
      if (diasTrabalhadosMes >= 15) avos++;
    } else if (m === mesFinal) {
      // Último mês do aviso prévio/demissão
      if (diaFinal >= 15) avos++;
    } else {
      // Meses intermediários completos
      avos++;
    }
  }

  return Math.min(Math.max(0, avos), 12);
}

/**
 * Calcula os avos de férias proporcionais considerando os períodos aquisitivos contratuais
 */
export function calculateAvosFeriasProporcionais(dataAdmissaoStr: string, dataProjecaoStr: string): number {
  const admParts = dataAdmissaoStr.split('-').map(Number);
  const demParts = dataProjecaoStr.split('-').map(Number);
  if (admParts.length !== 3 || demParts.length !== 3) return 0;

  const adm = new Date(admParts[0], admParts[1] - 1, admParts[2]);
  const dem = new Date(demParts[0], demParts[1] - 1, demParts[2]);
  if (dem <= adm) return 0;

  // Determina a data de início do último período aquisitivo
  let aquisitivoInicio = new Date(adm.getFullYear(), adm.getMonth(), adm.getDate());
  while (true) {
    const proximoAquisitivo = new Date(aquisitivoInicio.getFullYear() + 1, aquisitivoInicio.getMonth(), aquisitivoInicio.getDate());
    if (proximoAquisitivo <= dem) {
      aquisitivoInicio = proximoAquisitivo;
    } else {
      break;
    }
  }

  // Contagem de meses do período aquisitivo corrente
  let avos = 0;
  let curr = new Date(aquisitivoInicio.getFullYear(), aquisitivoInicio.getMonth(), aquisitivoInicio.getDate());

  for (let i = 1; i <= 12; i++) {
    const nextMonth = new Date(curr.getFullYear(), curr.getMonth() + 1, curr.getDate());
    if (nextMonth <= dem) {
      avos++;
      curr = nextMonth;
    } else {
      // Verifica fração de 15 dias ou mais
      const diffMs = dem.getTime() - curr.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays >= 15) {
        avos++;
      }
      break;
    }
  }

  return Math.min(Math.max(0, avos), 12);
}

/**
 * Tabela INSS 2026 (Portaria Interministerial MPS/MF nº 6/2025 - Salário Mínimo R$ 1.621,00)
 */
export function calculateInss(baseTributavel: number): number {
  if (baseTributavel <= 0) return 0;

  const f1Limit = 1621.00;
  const f2Limit = 2902.84;
  const f3Limit = 4354.27;
  const f4Limit = 8475.55;
  const inssTeto = 988.09;

  let inss = 0;

  if (baseTributavel <= f1Limit) {
    inss = baseTributavel * 0.075;
  } else if (baseTributavel <= f2Limit) {
    inss = (f1Limit * 0.075) + ((baseTributavel - f1Limit) * 0.09);
  } else if (baseTributavel <= f3Limit) {
    inss = (f1Limit * 0.075) + ((f2Limit - f1Limit) * 0.09) + ((baseTributavel - f2Limit) * 0.12);
  } else if (baseTributavel <= f4Limit) {
    inss = (f1Limit * 0.075) + ((f2Limit - f1Limit) * 0.09) + ((f3Limit - f2Limit) * 0.12) + ((baseTributavel - f3Limit) * 0.14);
  } else {
    inss = inssTeto;
  }

  return Math.min(roundCurrency(inss), inssTeto);
}

/**
 * Tabela IRRF 2026 (Lei nº 15.270/2025 - Isenção até R$ 5.000,00 em 2026)
 */
export function calculateIrrf(baseBruta: number, inssDescontado: number, dependentes: number = 0): number {
  const deducaoDependente = 189.59 * dependentes;
  const baseTributavel = Math.max(0, baseBruta - inssDescontado - deducaoDependente);

  // Regra de isenção expandida 2026 (Lei 15.270/2025) para rendimentos de até R$ 5.000
  if (baseTributavel <= 5000.00) {
    return 0;
  }

  let impostoBruto = 0;
  if (baseTributavel <= 2826.65) {
    impostoBruto = (baseTributavel * 0.075) - 182.16;
  } else if (baseTributavel <= 3751.05) {
    impostoBruto = (baseTributavel * 0.15) - 394.16;
  } else if (baseTributavel <= 4664.68) {
    impostoBruto = (baseTributavel * 0.225) - 675.49;
  } else {
    impostoBruto = (baseTributavel * 0.275) - 908.73;
  }

  impostoBruto = Math.max(0, impostoBruto);

  // Redutor adicional 2026 para faixa entre R$ 5.000,01 e R$ 7.350,00
  if (baseTributavel > 5000.00 && baseTributavel <= 7350.00) {
    const redutor = 978.62 - (0.133145 * baseTributavel);
    impostoBruto = Math.max(0, impostoBruto - Math.max(0, redutor));
  }

  return roundCurrency(impostoBruto);
}

/**
 * ENGINE CENTRAL DE CÁLCULO DE RESCISÃO TRABALHISTA
 */
export function calculateRescisao(input: RescisaoInput): RescisaoResult {
  const salarioBase = parseBrazilianNumber(input.salarioBase);
  const mediasAdicionais = parseBrazilianNumber(input.mediasAdicionais);
  const remuneracaoBase = salarioBase + mediasAdicionais;
  const saldoFgtsExtrato = parseBrazilianNumber(input.saldoFgtsExtrato);
  const dependentesIrrf = Math.max(0, input.dependentesIrrf || 0);

  const modalidade = input.modalidade || 'sem_justa_causa';
  const tipoAviso = input.tipoAviso || 'indenizado';

  const anosCompletos = calculateAnosCompletos(input.dataAdmissao, input.dataDemissao);
  const diasAvisoPrevio = calculateDiasAvisoPrevio(anosCompletos, modalidade);

  // Data de projeção do aviso prévio no tempo de serviço (OJ 82 SDI-1 TST)
  const projecaoDias = (modalidade === 'sem_justa_causa' || modalidade === 'acordo_mutuo') && tipoAviso === 'indenizado' ? diasAvisoPrevio : 0;
  const dataProjecaoAviso = addDaysToDate(input.dataDemissao, projecaoDias);

  const demParts = input.dataDemissao.split('-').map(Number);
  const diasTrabalhadosNoMes = demParts.length === 3 ? demParts[2] : 30;

  // Nomes e descrições das modalidades
  const modalidadeInfo: Record<ModalidadeRescisao, { nome: string; desc: string }> = {
    sem_justa_causa: {
      nome: 'Dispensa Sem Justa Causa',
      desc: 'Iniciativa do empregador sem motivo falta grave. Dá direito a aviso prévio, saque integral do FGTS com multa de 40% e seguro-desemprego.',
    },
    pedido_demissao: {
      nome: 'Pedido de Demissão',
      desc: 'Iniciativa do empregado. Dá direito a saldo de salário, 13º e férias. Não dá direito a saque de FGTS, multa rescisória nem seguro-desemprego.',
    },
    acordo_mutuo: {
      nome: 'Rescisão por Acordo (Art. 484-A CLT)',
      desc: 'Demissão consensual introduzida pela Reforma Trabalhista. Aviso prévio indenizado pago em 50%, multa do FGTS de 20% e saque de até 80% do FGTS.',
    },
    termino_contrato: {
      nome: 'Término de Contrato no Prazo',
      desc: 'Encerramento normal de contrato de experiência ou por prazo determinado. Dá direito a saldo, 13º, férias e saque do FGTS (sem multa de 40%).',
    },
  };

  const verbas: VerbaItem[] = [];

  // 1. SALDO DE SALÁRIO
  const valorDiarioSalario = remuneracaoBase / 30;
  const saldoSalarioValor = roundCurrency(valorDiarioSalario * Math.min(30, diasTrabalhadosNoMes));
  verbas.push({
    id: 'saldo_salario',
    descricao: 'Saldo de Salário',
    referencia: `${Math.min(30, diasTrabalhadosNoMes)} dias`,
    provento: saldoSalarioValor,
    desconto: 0,
    tipo: 'trct_provento',
    fundamentoLegal: 'Art. 457 e 464 da CLT',
  });

  // 2. AVISO PRÉVIO
  let avisoPrevioValorProvento = 0;
  let avisoPrevioValorDesconto = 0;

  if (modalidade === 'sem_justa_causa') {
    if (tipoAviso === 'indenizado') {
      avisoPrevioValorProvento = roundCurrency(valorDiarioSalario * diasAvisoPrevio);
      verbas.push({
        id: 'aviso_previo_indenizado',
        descricao: 'Aviso Prévio Indenizado',
        referencia: `${diasAvisoPrevio} dias`,
        provento: avisoPrevioValorProvento,
        desconto: 0,
        tipo: 'trct_provento',
        fundamentoLegal: 'Lei nº 12.506/2011 e Art. 487, § 1º da CLT',
      });
    } else if (tipoAviso === 'trabalhado') {
      verbas.push({
        id: 'aviso_previo_trabalhado',
        descricao: 'Aviso Prévio Trabalhado (em curso)',
        referencia: `${diasAvisoPrevio} dias`,
        provento: 0, // Pago como salário normal do mês correspondente
        desconto: 0,
        tipo: 'trct_provento',
        fundamentoLegal: 'Art. 487, caput e Art. 488 da CLT',
      });
    }
  } else if (modalidade === 'acordo_mutuo') {
    if (tipoAviso === 'indenizado') {
      // 50% do valor do aviso prévio proporcional
      avisoPrevioValorProvento = roundCurrency((valorDiarioSalario * diasAvisoPrevio) * 0.5);
      verbas.push({
        id: 'aviso_previo_acordo',
        descricao: 'Aviso Prévio Indenizado (50% por Acordo)',
        referencia: `${diasAvisoPrevio} dias (50%)`,
        provento: avisoPrevioValorProvento,
        desconto: 0,
        tipo: 'trct_provento',
        fundamentoLegal: 'Art. 484-A, I, "a" da CLT',
      });
    }
  } else if (modalidade === 'pedido_demissao') {
    if (tipoAviso === 'nao_cumprido') {
      avisoPrevioValorDesconto = roundCurrency(remuneracaoBase);
      verbas.push({
        id: 'desconto_aviso_previo',
        descricao: 'Desconto de Aviso Prévio Não Cumprido',
        referencia: '30 dias',
        provento: 0,
        desconto: avisoPrevioValorDesconto,
        tipo: 'trct_desconto',
        fundamentoLegal: 'Art. 487, § 2º da CLT',
      });
    }
  }

  // 3. 13º SALÁRIO PROPORCIONAL
  const avosDecimoTerceiro = calculateAvosDecimoTerceiro(input.dataAdmissao, dataProjecaoAviso);
  const decimoTerceiroValor = roundCurrency((remuneracaoBase / 12) * avosDecimoTerceiro);
  verbas.push({
    id: 'decimo_terceiro_proporcional',
    descricao: '13º Salário Proporcional',
    referencia: `${avosDecimoTerceiro}/12 avos`,
    provento: decimoTerceiroValor,
    desconto: 0,
    tipo: 'trct_provento',
    fundamentoLegal: 'Lei nº 4.090/62, Lei nº 4.749/65 e Decreto nº 10.854/2021',
  });

  // 4. FÉRIAS
  let totalFeriasValor = 0;

  // Férias Vencidas (se houver)
  if (input.possuiFeriasVencidas) {
    const multiplicador = input.feriasVencidasEmDobro ? 2 : 1;
    const feriasVencidasBase = roundCurrency(remuneracaoBase * multiplicador);
    const tercoVencidas = roundCurrency((remuneracaoBase / 3) * multiplicador);
    const totalVencidas = feriasVencidasBase + tercoVencidas;
    totalFeriasValor += totalVencidas;

    verbas.push({
      id: 'ferias_vencidas',
      descricao: input.feriasVencidasEmDobro ? 'Férias Vencidas em Dobro + 1/3' : 'Férias Vencidas Simples + 1/3',
      referencia: input.feriasVencidasEmDobro ? '30 dias (em dobro)' : '30 dias',
      provento: totalVencidas,
      desconto: 0,
      tipo: 'trct_provento',
      fundamentoLegal: input.feriasVencidasEmDobro ? 'Art. 137 da CLT e Súmula 328 do TST' : 'Art. 129 e 130 da CLT',
    });
  }

  // Férias Proporcionais + 1/3
  const avosFeriasProporcionais = calculateAvosFeriasProporcionais(input.dataAdmissao, dataProjecaoAviso);
  const feriasProporcionaisBase = roundCurrency((remuneracaoBase / 12) * avosFeriasProporcionais);
  const tercoProporcional = roundCurrency(feriasProporcionaisBase / 3);
  const feriasProporcionaisTotal = feriasProporcionaisBase + tercoProporcional;
  totalFeriasValor += feriasProporcionaisTotal;

  verbas.push({
    id: 'ferias_proporcionais',
    descricao: 'Férias Proporcionais + 1/3 Constitucional',
    referencia: `${avosFeriasProporcionais}/12 avos`,
    provento: feriasProporcionaisTotal,
    desconto: 0,
    tipo: 'trct_provento',
    fundamentoLegal: 'Art. 146 e 147 da CLT e Art. 7º, XVII da CF/88',
  });

  // 5. IMPOSTOS (INSS e IRRF)
  // INSS sobre Saldo de Salário
  const inssSalario = calculateInss(saldoSalarioValor);
  if (inssSalario > 0) {
    verbas.push({
      id: 'desconto_inss_salario',
      descricao: 'Desconto INSS sobre Saldo de Salário',
      referencia: 'Tabela Progressiva 2026',
      provento: 0,
      desconto: inssSalario,
      tipo: 'trct_desconto',
      fundamentoLegal: 'Portaria Interministerial MPS/MF nº 6/2025',
    });
  }

  // INSS sobre 13º Salário
  const inssDecimoTerceiro = calculateInss(decimoTerceiroValor);
  if (inssDecimoTerceiro > 0) {
    verbas.push({
      id: 'desconto_inss_13',
      descricao: 'Desconto INSS sobre 13º Salário',
      referencia: 'Tabela Progressiva 2026',
      provento: 0,
      desconto: inssDecimoTerceiro,
      tipo: 'trct_desconto',
      fundamentoLegal: 'Art. 7º da Lei nº 8.620/93',
    });
  }

  // IRRF sobre Saldo de Salário
  const irrfSalario = calculateIrrf(saldoSalarioValor, inssSalario, dependentesIrrf);
  if (irrfSalario > 0) {
    verbas.push({
      id: 'desconto_irrf_salario',
      descricao: 'Desconto IRRF sobre Saldo de Salário',
      referencia: 'Lei nº 15.270/2025',
      provento: 0,
      desconto: irrfSalario,
      tipo: 'trct_desconto',
      fundamentoLegal: 'Art. 7º da Lei nº 7.713/88',
    });
  }

  // IRRF sobre 13º Salário
  const irrfDecimoTerceiro = calculateIrrf(decimoTerceiroValor, inssDecimoTerceiro, dependentesIrrf);
  if (irrfDecimoTerceiro > 0) {
    verbas.push({
      id: 'desconto_irrf_13',
      descricao: 'Desconto IRRF sobre 13º Salário',
      referencia: 'Lei nº 15.270/2025',
      provento: 0,
      desconto: irrfDecimoTerceiro,
      tipo: 'trct_desconto',
      fundamentoLegal: 'Tributação exclusiva na fonte',
    });
  }

  // CÁLCULO DOS TOTAIS TRCT (EMPREGADOR)
  let totalProventosTrct = 0;
  let totalDescontosTrct = 0;

  verbas.forEach((v) => {
    if (v.tipo === 'trct_provento') totalProventosTrct += v.provento;
    if (v.tipo === 'trct_desconto') totalDescontosTrct += v.desconto;
  });

  totalProventosTrct = roundCurrency(totalProventosTrct);
  totalDescontosTrct = roundCurrency(totalDescontosTrct);
  const liquidoTrct = roundCurrency(Math.max(0, totalProventosTrct - totalDescontosTrct));

  // 6. FGTS E MULTA RESCISÓRIA (CAIXA ECONÔMICA FEDERAL)
  // Depósitos rescisórios (8% sobre saldo de salário + 13º total + aviso prévio indenizado)
  const baseDepositosRescisorios = saldoSalarioValor + decimoTerceiroValor + avisoPrevioValorProvento;
  const fgtsDepositosRescisorios = roundCurrency(baseDepositosRescisorios * 0.08);

  const fgtsBaseMulta = roundCurrency(saldoFgtsExtrato + fgtsDepositosRescisorios);

  let fgtsPercentualMulta = 0;
  let fgtsValorMulta = 0;
  let fgtsValorSaquePermitido = 0;
  let fgtsRetidoNaCaixa = 0;
  let fgtsCodigoSaque = 'Nenhum';

  if (modalidade === 'sem_justa_causa') {
    fgtsPercentualMulta = 40;
    fgtsValorMulta = roundCurrency(fgtsBaseMulta * 0.40);
    fgtsValorSaquePermitido = roundCurrency(fgtsBaseMulta + fgtsValorMulta);
    fgtsRetidoNaCaixa = 0;
    fgtsCodigoSaque = 'Código 01 (Saque Integral + Multa 40%)';
  } else if (modalidade === 'acordo_mutuo') {
    fgtsPercentualMulta = 20;
    fgtsValorMulta = roundCurrency(fgtsBaseMulta * 0.20);
    // Art. 484-A, § 1º, II: Saque de até 80% dos depósitos + 100% da multa de 20%
    const saqueDepositos80 = roundCurrency(fgtsBaseMulta * 0.80);
    fgtsValorSaquePermitido = roundCurrency(saqueDepositos80 + fgtsValorMulta);
    fgtsRetidoNaCaixa = roundCurrency(fgtsBaseMulta * 0.20);
    fgtsCodigoSaque = 'Código 07 (Saque 80% + Multa 20%)';
  } else if (modalidade === 'termino_contrato') {
    fgtsPercentualMulta = 0;
    fgtsValorMulta = 0;
    fgtsValorSaquePermitido = fgtsBaseMulta;
    fgtsRetidoNaCaixa = 0;
    fgtsCodigoSaque = 'Código 04 (Término de Contrato)';
  } else {
    // pedido_demissao
    fgtsPercentualMulta = 0;
    fgtsValorMulta = 0;
    fgtsValorSaquePermitido = 0;
    fgtsRetidoNaCaixa = fgtsBaseMulta;
    fgtsCodigoSaque = 'Retido (Sem Saque Imediato)';
  }

  // TOTAL GERAL ESTIMADO
  const totalGeralEstimado = roundCurrency(liquidoTrct + fgtsValorSaquePermitido);
  const direitoSeguroDesemprego = modalidade === 'sem_justa_causa';
  const prazoPagamentoDias = 10; // Art. 477, § 6º da CLT (10 dias corridos)

  // GERAÇÃO PROGRAMÁTICA DO RESUMO TEXTUAL
  const resumoTextual = buildResumoTextual({
    modalidadeNome: modalidadeInfo[modalidade].nome,
    salarioBase,
    liquidoTrct,
    fgtsValorSaquePermitido,
    totalGeralEstimado,
    avosDecimoTerceiro,
    avosFeriasProporcionais,
    diasAvisoPrevio,
    modalidade,
  });

  return {
    salarioBase,
    remuneracaoBase,
    dataAdmissao: input.dataAdmissao,
    dataDemissao: input.dataDemissao,
    modalidade,
    modalidadeNome: modalidadeInfo[modalidade].nome,
    modalidadeDescricao: modalidadeInfo[modalidade].desc,
    anosCompletos,
    diasAvisoPrevio,
    dataProjecaoAviso,
    avosDecimoTerceiro,
    avosFeriasProporcionais,
    verbas,
    totalProventosTrct,
    totalDescontosTrct,
    liquidoTrct,
    fgtsDepositosRescisorios,
    fgtsBaseMulta,
    fgtsPercentualMulta,
    fgtsValorMulta,
    fgtsValorSaquePermitido,
    fgtsRetidoNaCaixa,
    fgtsCodigoSaque,
    totalGeralEstimado,
    direitoSeguroDesemprego,
    prazoPagamentoDias,
    inssSalario,
    inssDecimoTerceiro,
    totalInss: roundCurrency(inssSalario + inssDecimoTerceiro),
    irrfTotal: roundCurrency(irrfSalario + irrfDecimoTerceiro),
    resumoTextual,
  };
}

/**
 * Constrói resumo textual em linguagem natural sem hardcode
 */
function buildResumoTextual(params: {
  modalidadeNome: string;
  salarioBase: number;
  liquidoTrct: number;
  fgtsValorSaquePermitido: number;
  totalGeralEstimado: number;
  avosDecimoTerceiro: number;
  avosFeriasProporcionais: number;
  diasAvisoPrevio: number;
  modalidade: ModalidadeRescisao;
}): string {
  const { modalidadeNome, liquidoTrct, fgtsValorSaquePermitido, avosDecimoTerceiro, avosFeriasProporcionais, modalidade } = params;

  let txt = `Com base nas informações prestadas para a modalidade ${modalidadeNome}, o valor líquido estimado a ser pago pelo empregador é de ${formatBRL(liquidoTrct)}. `;

  txt += `Nesta simulação, foram considerados ${avosDecimoTerceiro}/12 de 13º salário proporcional e ${avosFeriasProporcionais}/12 de férias proporcionais com 1/3 constitucional. `;

  if (modalidade === 'sem_justa_causa' || modalidade === 'acordo_mutuo' || modalidade === 'termino_contrato') {
    txt += `Adicionalmente, você poderá ter o saque de até ${formatBRL(fgtsValorSaquePermitido)} liberado na conta do FGTS na Caixa Econômica Federal. `;
  } else if (modalidade === 'pedido_demissao') {
    txt += `No pedido de demissão, o saldo do FGTS permanece retido na conta vinculada da Caixa, sem liberação imediata. `;
  }

  return txt;
}

/**
 * GERA SIMULAÇÃO COMPARATIVA ENTRE AS 4 MODALIDADES
 */
export function compareModalidades(input: RescisaoInput): ComparacaoModalidade[] {
  const modalidadesSuportadas: ModalidadeRescisao[] = [
    'sem_justa_causa',
    'pedido_demissao',
    'acordo_mutuo',
    'termino_contrato',
  ];

  const atualResult = calculateRescisao(input);

  return modalidadesSuportadas.map((mod) => {
    // Tipo de aviso compatível para a simulação comparativa
    let tipoAvisoComp: TipoAvisoPrevio = 'indenizado';
    if (mod === 'pedido_demissao') tipoAvisoComp = 'trabalhado';
    if (mod === 'termino_contrato') tipoAvisoComp = 'indenizado';

    const simInput: RescisaoInput = {
      ...input,
      modalidade: mod,
      tipoAviso: tipoAvisoComp,
    };

    const simRes = calculateRescisao(simInput);
    const diff = simRes.totalGeralEstimado - atualResult.totalGeralEstimado;

    return {
      modalidade: mod,
      nome: simRes.modalidadeNome,
      liquidoTrct: simRes.liquidoTrct,
      fgtsSaque: simRes.fgtsValorSaquePermitido,
      totalGeral: simRes.totalGeralEstimado,
      diferencaParaAtual: roundCurrency(diff),
    };
  });
}
