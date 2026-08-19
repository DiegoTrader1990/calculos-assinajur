'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  calculateRescisao,
  compareModalidades,
  parseBrazilianNumber,
  formatBRL,
  RescisaoInput,
  ModalidadeRescisao,
  TipoAvisoPrevio,
  VerbaItem,
} from '@/lib/calculators/rescisao-clt';
import {
  Calculator,
  RotateCcw,
  Copy,
  Check,
  Share2,
  HelpCircle,
  Briefcase,
  AlertCircle,
  FileCheck2,
  Building,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Ban,
  Scale
} from 'lucide-react';

interface Props {
  initialSearchParams?: Record<string, string | string[] | undefined>;
}

export default function RescisaoCLTCalculator({ initialSearchParams }: Props) {
  // Estado dos parâmetros do formulário
  const [salarioInput, setSalarioInput] = useState<string>('3.500,00');
  const [dataAdmissao, setDataAdmissao] = useState<string>('2023-03-15');
  const [dataDemissao, setDataDemissao] = useState<string>('2026-08-20');
  const [modalidade, setModalidade] = useState<ModalidadeRescisao>('sem_justa_causa');
  const [tipoAviso, setTipoAviso] = useState<TipoAvisoPrevio>('indenizado');
  
  // Opcionais
  const [saldoFgtsInput, setSaldoFgtsInput] = useState<string>('8.000,00');
  const [possuiFeriasVencidas, setPossuiFeriasVencidas] = useState<boolean>(false);
  const [feriasVencidasEmDobro, setFeriasVencidasEmDobro] = useState<boolean>(false);
  const [mediasAdicionaisInput, setMediasAdicionaisInput] = useState<string>('0,00');
  const [dependentesIrrf, setDependentesIrrf] = useState<number>(0);
  
  // UI states
  const [showOpcionais, setShowOpcionais] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [activeTabDetalhamento, setActiveTabDetalhamento] = useState<'todos' | 'proventos' | 'descontos'>('todos');

  // Ajusta o tipo de aviso quando a modalidade muda para manter consistência
  useEffect(() => {
    if (modalidade === 'pedido_demissao') {
      setTipoAviso('trabalhado');
    } else if (modalidade === 'termino_contrato') {
      setTipoAviso('dispensado');
    } else if (modalidade === 'sem_justa_causa' || modalidade === 'acordo_mutuo') {
      setTipoAviso('indenizado');
    }
  }, [modalidade]);

  // Executa o cálculo determinístico
  const result = useMemo(() => {
    const input: RescisaoInput = {
      salarioBase: parseBrazilianNumber(salarioInput),
      dataAdmissao,
      dataDemissao,
      modalidade,
      tipoAviso,
      saldoFgtsExtrato: parseBrazilianNumber(saldoFgtsInput),
      possuiFeriasVencidas,
      feriasVencidasEmDobro,
      mediasAdicionais: parseBrazilianNumber(mediasAdicionaisInput),
      dependentesIrrf,
    };
    return calculateRescisao(input);
  }, [
    salarioInput,
    dataAdmissao,
    dataDemissao,
    modalidade,
    tipoAviso,
    saldoFgtsInput,
    possuiFeriasVencidas,
    feriasVencidasEmDobro,
    mediasAdicionaisInput,
    dependentesIrrf,
  ]);

  // Simulação comparativa entre modalidades
  const comparativos = useMemo(() => {
    const input: RescisaoInput = {
      salarioBase: parseBrazilianNumber(salarioInput),
      dataAdmissao,
      dataDemissao,
      modalidade,
      tipoAviso,
      saldoFgtsExtrato: parseBrazilianNumber(saldoFgtsInput),
      possuiFeriasVencidas,
      feriasVencidasEmDobro,
      mediasAdicionais: parseBrazilianNumber(mediasAdicionaisInput),
      dependentesIrrf,
    };
    return compareModalidades(input);
  }, [
    salarioInput,
    dataAdmissao,
    dataDemissao,
    modalidade,
    tipoAviso,
    saldoFgtsInput,
    possuiFeriasVencidas,
    feriasVencidasEmDobro,
    mediasAdicionaisInput,
    dependentesIrrf,
  ]);

  // Reset do formulário
  const handleReset = () => {
    setSalarioInput('3.500,00');
    setDataAdmissao('2023-03-15');
    setDataDemissao('2026-08-20');
    setModalidade('sem_justa_causa');
    setTipoAviso('indenizado');
    setSaldoFgtsInput('8.000,00');
    setPossuiFeriasVencidas(false);
    setFeriasVencidasEmDobro(false);
    setMediasAdicionaisInput('0,00');
    setDependentesIrrf(0);
    setShowOpcionais(false);
  };

  // Copiar resumo formatado
  const handleCopy = () => {
    const texto = `SIMULAÇÃO DE RESCISÃO TRABALHISTA (CLT)
----------------------------------------
Modalidade: ${result.modalidadeNome}
Salário Base: ${formatBRL(result.salarioBase)}
Data Admissão: ${new Date(dataAdmissao + 'T00:00:00').toLocaleDateString('pt-BR')}
Data Desligamento: ${new Date(dataDemissao + 'T00:00:00').toLocaleDateString('pt-BR')}

RESUMO DA ESTIMATIVA:
• Líquido Empregador (TRCT): ${formatBRL(result.liquidoTrct)}
• Saque FGTS + Multa (Caixa): ${formatBRL(result.fgtsValorSaquePermitido)}
• Descontos Estimados: ${formatBRL(result.totalDescontosTrct)}

TOTAL GERAL ESTIMADO: ${formatBRL(result.totalGeralEstimado)}

Calculado em: https://calculos.assinajur.com.br/trabalhista/rescisao`;

    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Filtra verbas para a aba de detalhamento
  const verbasFiltradas = useMemo(() => {
    if (activeTabDetalhamento === 'proventos') return result.verbas.filter(v => v.tipo === 'trct_provento');
    if (activeTabDetalhamento === 'descontos') return result.verbas.filter(v => v.tipo === 'trct_desconto');
    return result.verbas;
  }, [result.verbas, activeTabDetalhamento]);

  return (
    <div className="space-y-8">

      {/* FORMULÁRIO DE PREENCHIMENTO PROGRESSIVO */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm">
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
              Simulador Interativo
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Informe os dados do seu contrato
            </h2>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Redefinir
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setHasCalculated(true); }} className="space-y-6">
          
          {/* ETAPA 1: SEU CONTRATO */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[11px] font-bold">1</span>
              Seu Contrato & Salário
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Salário Bruto Contratual (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                  <input
                    type="text"
                    value={salarioInput}
                    onChange={(e) => setSalarioInput(e.target.value)}
                    placeholder="3.500,00"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Data de Admissão
                </label>
                <input
                  type="date"
                  value={dataAdmissao}
                  onChange={(e) => setDataAdmissao(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Data do Desligamento
                </label>
                <input
                  type="date"
                  value={dataDemissao}
                  onChange={(e) => setDataDemissao(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* ETAPA 2: COMO OCORREU O DESLIGAMENTO? */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[11px] font-bold">2</span>
              Como ocorreu o desligamento?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Demissão sem justa causa */}
              <button
                type="button"
                onClick={() => setModalidade('sem_justa_causa')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  modalidade === 'sem_justa_causa'
                    ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-200 text-sky-900'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs">Sem Justa Causa</span>
                    {modalidade === 'sem_justa_causa' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Empresa decidiu encerrar o contrato. Dá direito a aviso, 40% FGTS e seguro.
                  </p>
                </div>
              </button>

              {/* Pedido de demissão */}
              <button
                type="button"
                onClick={() => setModalidade('pedido_demissao')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  modalidade === 'pedido_demissao'
                    ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-200 text-sky-900'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs">Pedi Demissão</span>
                    {modalidade === 'pedido_demissao' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Você pediu para sair. Recebe saldo, 13º e férias. Sem saque de FGTS.
                  </p>
                </div>
              </button>

              {/* Acordo mútuo */}
              <button
                type="button"
                onClick={() => setModalidade('acordo_mutuo')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  modalidade === 'acordo_mutuo'
                    ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-200 text-sky-900'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs">Fiz Acordo (Art. 484-A)</span>
                    {modalidade === 'acordo_mutuo' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Acordo consensual. Aviso 50%, multa FGTS 20% e saque de 80% do saldo.
                  </p>
                </div>
              </button>

              {/* Término de contrato */}
              <button
                type="button"
                onClick={() => setModalidade('termino_contrato')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  modalidade === 'termino_contrato'
                    ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-200 text-sky-900'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs">Término de Contrato</span>
                    {modalidade === 'termino_contrato' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Fim do prazo de experiência. Recebe saldo, 13º, férias e saque do FGTS.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* ETAPA 3: AVISO PRÉVIO (CAMPOS CONDICIONAIS) */}
          {modalidade !== 'termino_contrato' && (
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[11px] font-bold">3</span>
                Aviso Prévio ({result.diasAvisoPrevio} dias calculados)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modalidade === 'sem_justa_causa' && (
                  <>
                    <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 ${tipoAviso === 'indenizado' ? 'bg-sky-50 border-sky-400' : 'bg-slate-50 border-slate-200'}`}>
                      <input
                        type="radio"
                        name="tipoAviso"
                        checked={tipoAviso === 'indenizado'}
                        onChange={() => setTipoAviso('indenizado')}
                        className="mt-0.5 text-sky-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Indenizado pelo Empregador</span>
                        <span className="text-[11px] text-slate-500 leading-normal">
                          Você sai imediatamente e recebe o valor proporcional a {result.diasAvisoPrevio} dias.
                        </span>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 ${tipoAviso === 'trabalhado' ? 'bg-sky-50 border-sky-400' : 'bg-slate-50 border-slate-200'}`}>
                      <input
                        type="radio"
                        name="tipoAviso"
                        checked={tipoAviso === 'trabalhado'}
                        onChange={() => setTipoAviso('trabalhado')}
                        className="mt-0.5 text-sky-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Trabalhado</span>
                        <span className="text-[11px] text-slate-500 leading-normal">
                          Você cumpre os dias trabalhando (com redução de 2h/dia ou 7 dias ao final).
                        </span>
                      </div>
                    </label>
                  </>
                )}

                {modalidade === 'pedido_demissao' && (
                  <>
                    <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 ${tipoAviso === 'trabalhado' ? 'bg-sky-50 border-sky-400' : 'bg-slate-50 border-slate-200'}`}>
                      <input
                        type="radio"
                        name="tipoAviso"
                        checked={tipoAviso === 'trabalhado'}
                        onChange={() => setTipoAviso('trabalhado')}
                        className="mt-0.5 text-sky-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Vou trabalhar os 30 dias</span>
                        <span className="text-[11px] text-slate-500 leading-normal">
                          Cumpre os 30 dias na empresa e recebe o salário normal do mês.
                        </span>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 ${tipoAviso === 'nao_cumprido' ? 'bg-sky-50 border-sky-400' : 'bg-slate-50 border-slate-200'}`}>
                      <input
                        type="radio"
                        name="tipoAviso"
                        checked={tipoAviso === 'nao_cumprido'}
                        onChange={() => setTipoAviso('nao_cumprido')}
                        className="mt-0.5 text-sky-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Não vou cumprir (Desconto)</span>
                        <span className="text-[11px] text-slate-500 leading-normal">
                          Saída imediata. O valor de 1 salário (30 dias) será descontado na rescisão.
                        </span>
                      </div>
                    </label>
                  </>
                )}

                {modalidade === 'acordo_mutuo' && (
                  <>
                    <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 ${tipoAviso === 'indenizado' ? 'bg-sky-50 border-sky-400' : 'bg-slate-50 border-slate-200'}`}>
                      <input
                        type="radio"
                        name="tipoAviso"
                        checked={tipoAviso === 'indenizado'}
                        onChange={() => setTipoAviso('indenizado')}
                        className="mt-0.5 text-sky-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Indenizado (50% do valor)</span>
                        <span className="text-[11px] text-slate-500 leading-normal">
                          Saída imediata. Recebe metade do valor do aviso prévio proporcional (Art. 484-A CLT).
                        </span>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 ${tipoAviso === 'trabalhado' ? 'bg-sky-50 border-sky-400' : 'bg-slate-50 border-slate-200'}`}>
                      <input
                        type="radio"
                        name="tipoAviso"
                        checked={tipoAviso === 'trabalhado'}
                        onChange={() => setTipoAviso('trabalhado')}
                        className="mt-0.5 text-sky-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Trabalhado integralmente</span>
                        <span className="text-[11px] text-slate-500 leading-normal">
                          Trabalha os dias normais de aviso até a data de encerramento do acordo.
                        </span>
                      </div>
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {/* PAINEL RECOLHÍVEL DE VALORES OPCIONAIS (FÉRIAS, FGTS, MÉDIAS) */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowOpcionais(!showOpcionais)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-sky-700 py-2 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Informações adicionais (Férias vencidas, Saldo FGTS e Adicionais)
              </span>
              {showOpcionais ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showOpcionais && (
              <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 animate-in fade-in duration-200">
                
                {/* Férias Vencidas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Possui Férias Vencidas?
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                      <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <input
                          type="radio"
                          name="feriasVencidas"
                          checked={!possuiFeriasVencidas}
                          onChange={() => { setPossuiFeriasVencidas(false); setFeriasVencidasEmDobro(false); }}
                          className="text-sky-600"
                        />
                        Não
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <input
                          type="radio"
                          name="feriasVencidas"
                          checked={possuiFeriasVencidas && !feriasVencidasEmDobro}
                          onChange={() => { setPossuiFeriasVencidas(true); setFeriasVencidasEmDobro(false); }}
                          className="text-sky-600"
                        />
                        Sim (Simples)
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <input
                          type="radio"
                          name="feriasVencidas"
                          checked={possuiFeriasVencidas && feriasVencidasEmDobro}
                          onChange={() => { setPossuiFeriasVencidas(true); setFeriasVencidasEmDobro(true); }}
                          className="text-sky-600"
                        />
                        Sim (Em Dobro - Art. 137)
                      </label>
                    </div>
                  </div>

                  {/* Saldo FGTS */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Saldo do Extrato do FGTS (R$)
                    </label>
                    <input
                      type="text"
                      value={saldoFgtsInput}
                      onChange={(e) => setSaldoFgtsInput(e.target.value)}
                      placeholder="8.000,00"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-sky-500"
                    />
                    <span className="text-[10px] text-slate-400">Usado para calcular a multa de 40% ou 20% do FGTS.</span>
                  </div>
                </div>

                {/* Médias de horas extras e adicionais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Média mensal de Adicionais / Horas Extras (R$)
                    </label>
                    <input
                      type="text"
                      value={mediasAdicionaisInput}
                      onChange={(e) => setMediasAdicionaisInput(e.target.value)}
                      placeholder="0,00"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-sky-500"
                    />
                    <span className="text-[10px] text-slate-400">Comissões, adicional noturno, periculosidade, insalubridade.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dependentes para IRRF
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={dependentesIrrf}
                      onChange={(e) => setDependentesIrrf(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-sky-500"
                    />
                    <span className="text-[10px] text-slate-400">Dedução legal de R$ 189,59 por dependente.</span>
                  </div>
                </div>

              </div>
            )}
          </div>

        </form>

      </div>

      {/* ÁREA DE RESULTADO PRINCIPAL DA RESCISÃO */}
      <div className="space-y-6">
        
        {/* CARD DE DESTAQUE DO VALOR ESTIMADO TOTAL */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/50">
                Resultado da Simulação
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
                {formatBRL(result.totalGeralEstimado)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Estimativa total com base nas informações fornecidas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar Resumo'}
              </button>
            </div>
          </div>

          {/* DIVISÃO DAS 3 FONTES DE RECEBIMENTO / DESCONTO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Líquido a receber do Empregador (TRCT) */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
                <Building className="w-4 h-4 text-sky-400" />
                Pago pelo Empregador (TRCT)
              </div>
              <div className="text-xl font-bold text-sky-400">
                {formatBRL(result.liquidoTrct)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Proventos: {formatBRL(result.totalProventosTrct)} | Descontos: {formatBRL(result.totalDescontosTrct)}
              </div>
            </div>

            {/* 2. FGTS e Multa na Caixa Econômica Federal */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                FGTS + Multa (Caixa)
              </div>
              <div className="text-xl font-bold text-emerald-400">
                {formatBRL(result.fgtsValorSaquePermitido)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {result.fgtsPercentualMulta > 0 ? `Inclui multa de ${result.fgtsPercentualMulta}% (${formatBRL(result.fgtsValorMulta)})` : result.fgtsCodigoSaque}
              </div>
            </div>

            {/* 3. Descontos Estimados */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
                <Ban className="w-4 h-4 text-rose-400" />
                Descontos Estimados
              </div>
              <div className="text-xl font-bold text-rose-400">
                {formatBRL(result.totalDescontosTrct)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                INSS: {formatBRL(result.totalInss)} | IRRF: {formatBRL(result.irrfTotal)}
              </div>
            </div>

          </div>

          {/* INDICADORES ADICIONAIS (SEGURO DESEMPREGO E PRAZO) */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${result.direitoSeguroDesemprego ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>
                Seguro-Desemprego: <strong className={result.direitoSeguroDesemprego ? 'text-emerald-400' : 'text-slate-400'}>{result.direitoSeguroDesemprego ? 'Elegível para solicitação' : 'Não aplicável nesta modalidade'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Prazo de Pagamento Legal: <strong>Até 10 dias corridos (Art. 477, § 6º)</strong></span>
            </div>
          </div>

        </div>

        {/* ENTENDA SEU RESULTADO (RESUMO EM LINGUAGEM NATURAL) */}
        <div className="bg-sky-50/70 rounded-2xl p-5 border border-sky-200/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Entenda seu resultado
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {result.resumoTextual}
            </p>
          </div>
        </div>

        {/* DIFERENCIAL INTERATIVO 1: ENTENDA SEU DESLIGAMENTO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                Análise Jurídica do Cenário
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Entenda a modalidade: {result.modalidadeNome}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {result.modalidadeDescricao}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">Aviso Prévio Aplicado</span>
              <p className="text-slate-600 leading-normal">
                {result.diasAvisoPrevio} dias de aviso prévio calculados para {result.anosCompletos} anos completos de trabalho.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">Regra de Liberação do FGTS</span>
              <p className="text-slate-600 leading-normal">
                {result.fgtsCodigoSaque}. Multa rescisória de {result.fgtsPercentualMulta}% sobre o saldo total.
              </p>
            </div>
          </div>
        </div>

        {/* DIFERENCIAL INTERATIVO 2: SIMULAÇÃO COMPARATIVA ENTRE MODALIDADES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Simulação Comparativa
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Como mudaria o valor em outras modalidades?
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline-block">
              Simulação baseada nos mesmos dados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {comparativos.map((comp) => {
              const isCurrent = comp.modalidade === modalidade;
              return (
                <div
                  key={comp.modalidade}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-200'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900">{comp.nome}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                        Atual
                      </span>
                    )}
                  </div>

                  <div className="text-base font-extrabold text-slate-900 mb-1">
                    {formatBRL(comp.totalGeral)}
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>TRCT: {formatBRL(comp.liquidoTrct)}</div>
                    <div>FGTS Saque: {formatBRL(comp.fgtsSaque)}</div>
                  </div>

                  {!isCurrent && (
                    <div className={`text-[11px] font-bold mt-2 pt-2 border-t border-slate-200/80 ${comp.diferencaParaAtual >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {comp.diferencaParaAtual >= 0 ? '+' : ''}{formatBRL(comp.diferencaParaAtual)} vs atual
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
            * As comparações são simulações matemáticas explicativas baseadas estritamente nos dados contratuais informados. Não constituem recomendação jurídica ou estímulo à alteração de modalidades de desligamento.
          </p>
        </div>

        {/* DETALHAMENTO DAS VERBAS ("COMO CHEGAMOS A ESTE VALOR?") */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                Transparência Absoluta
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Como chegamos a este valor?
              </h3>
            </div>

            {/* Abas de filtro */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTabDetalhamento('todos')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTabDetalhamento === 'todos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Todas ({result.verbas.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTabDetalhamento('proventos')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTabDetalhamento === 'proventos' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Proventos
              </button>
              <button
                type="button"
                onClick={() => setActiveTabDetalhamento('descontos')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTabDetalhamento === 'descontos' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Descontos
              </button>
            </div>
          </div>

          {/* Tabela de Verbas Detalhada */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Verba / Item</th>
                  <th className="py-3 px-3">Referência</th>
                  <th className="py-3 px-3 text-right">Provento</th>
                  <th className="py-3 px-3 text-right">Desconto</th>
                  <th className="py-3 px-3">Fundamento Legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {verbasFiltradas.map((verba) => (
                  <tr key={verba.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {verba.descricao}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {verba.referencia}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                      {verba.provento > 0 ? formatBRL(verba.provento) : '-'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-rose-600">
                      {verba.desconto > 0 ? formatBRL(verba.desconto) : '-'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {verba.fundamentoLegal}
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
