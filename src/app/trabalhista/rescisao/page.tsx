import { Metadata } from 'next';
import CalculatorTemplate, { ExampleItem, FAQItem } from '@/components/CalculatorTemplate';
import RescisaoCLTCalculator from '@/components/calculators/RescisaoCLT';
import { getCalculatorBySlug } from '@/data/calculators';
import { calculateRescisao, formatBRL } from '@/lib/calculators/rescisao-clt';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Calculadora de Rescisão Trabalhista 2026 | Cálculos por AssinaJur',
  description: 'Calcule gratuitamente o valor estimado da sua rescisão trabalhista CLT. Simulador para demissão sem justa causa, pedido de demissão, acordo mútuo e término de contrato com aviso prévio, férias, 13º e FGTS.',
  alternates: {
    canonical: 'https://calculos.assinajur.com.br/trabalhista/rescisao',
  },
  openGraph: {
    title: 'Calculadora de Rescisão Trabalhista CLT 2026 — Simulador Gratuito',
    description: 'Descubra quanto você tem a receber na rescisão de trabalho com base nas regras atualizadas da CLT e tabelas 2026.',
    url: 'https://calculos.assinajur.com.br/trabalhista/rescisao',
    type: 'website',
  },
};

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function RescisaoPage({ searchParams }: PageProps) {
  const calculator = getCalculatorBySlug('trabalhista', 'rescisao');

  if (!calculator) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Trabalhista', href: '/trabalhista' },
    { label: 'Calculadora de Rescisão Trabalhista' },
  ];

  // EXEMPLOS MATEMÁTICOS E JURÍDICOS CALCULADOS DINAMICAMENTE PELA MESMA ENGINE CENTRAL
  const ex1Result = calculateRescisao({
    salarioBase: 4000,
    mediasAdicionais: 500,
    dataAdmissao: '2023-03-10',
    dataDemissao: '2026-08-20',
    modalidade: 'sem_justa_causa',
    tipoAviso: 'indenizado',
    possuiFeriasVencidas: true,
    saldoFgtsExtrato: 12000,
  });

  const ex2Result = calculateRescisao({
    salarioBase: 3000,
    dataAdmissao: '2025-02-01',
    dataDemissao: '2025-07-15',
    modalidade: 'pedido_demissao',
    tipoAviso: 'nao_cumprido',
    possuiFeriasVencidas: false,
    saldoFgtsExtrato: 1200,
  });

  const examples: ExampleItem[] = [
    {
      title: 'Exemplo 1: Demissão Sem Justa Causa (3 Anos de Empresa + Férias Vencidas)',
      description: 'Salário de R$ 4.000,00 + R$ 500,00 de adicionais. Aviso prévio proporcional de 39 dias indenizado e saldo de FGTS de R$ 12.000,00.',
      result: `Líquido Empregador (TRCT): ${formatBRL(ex1Result.liquidoTrct)} | Saque FGTS + 40%: ${formatBRL(ex1Result.fgtsValorSaquePermitido)} | Total Estimado: ${formatBRL(ex1Result.totalGeralEstimado)}`,
    },
    {
      title: 'Exemplo 2: Pedido de Demissão com Aviso Não Cumprido (5 Meses de Trabalho)',
      description: 'Salário de R$ 3.000,00 sem aviso trabalhado (desconto de 30 dias de salário). Sem férias vencidas.',
      result: `Líquido a Receber: ${formatBRL(ex2Result.liquidoTrct)} | FGTS Retido na Caixa: ${formatBRL(ex2Result.fgtsBaseMulta)} (sem saque imediato)`,
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'Como é calculada a rescisão trabalhista?',
      answer:
        'O cálculo da rescisão soma as verbas a que o trabalhador tem direito (saldo de salário, aviso prévio, 13º proporcional, férias vencidas e proporcionais com 1/3) e subtrai os descontos legais (INSS, IRRF e faltas ou aviso prévio não cumprido). O resultado varia conforme a modalidade de desligamento.',
    },
    {
      question: 'O que recebo se for demitido sem justa causa?',
      answer:
        'Na demissão sem justa causa, o trabalhador recebe saldo de salário, aviso prévio (trabalhado ou indenizado com projeção), 13º proporcional, férias vencidas e proporcionais + 1/3, saque integral do saldo do FGTS com multa rescisória de 40% e guias para habilitação no Seguro-Desemprego.',
    },
    {
      question: 'O que recebo se pedir demissão?',
      answer:
        'No pedido de demissão, você recebe o saldo de salário, 13º proporcional e férias vencidas/proporcionais + 1/3. Não há direito à multa de 40%, nem ao saque imediato do FGTS ou seguro-desemprego. Se você não trabalhar o aviso prévio de 30 dias, o empregador poderá descontar o valor correspondente.',
    },
    {
      question: 'Como funciona a rescisão por acordo (Art. 484-A da CLT)?',
      answer:
        'Na demissão por acordo mútuo, o aviso prévio indenizado é pago pela metade (50%), a multa do FGTS é de 20% e o trabalhador pode sacar até 80% do saldo total depositado no FGTS. As demais verbas (saldo, 13º e férias) são pagas integralmente. Não dá direito ao seguro-desemprego.',
    },
    {
      question: 'Como funciona a regra do aviso prévio proporcional (Lei 12.506/2011)?',
      answer:
        'A todos os contratos com mais de 1 ano completo na mesma empresa, são acrescidos 3 dias de aviso prévio por ano de serviço prestado, até o limite máximo de 90 dias (para 20 anos ou mais). Essa regra aplica-se exclusivamente a favor do empregado na demissão sem justa causa.',
    },
    {
      question: 'Como são calculadas as férias proporcionais?',
      answer:
        'Conta-se cada mês ou fração igual ou superior a 15 dias trabalhados dentro do período aquisitivo contratual como 1/12 avo de férias. Sobre o valor obtido, acrescenta-se o adicional de 1/3 constitucional.',
    },
    {
      question: 'Como é calculado o 13º salário proporcional?',
      answer:
        'Calcula-se dividindo o salário por 12 e multiplicando pelo número de meses em que o empregado trabalhou 15 dias ou mais dentro do ano civil (de janeiro a dezembro), incluindo a projeção do aviso prévio indenizado.',
    },
    {
      question: 'O FGTS e a multa estão incluídos no valor líquido pago pelo empregador?',
      answer:
        'Não. O empregador paga diretamente as verbas da rescisão (TRCT). O saldo acumulado do FGTS e a multa rescisória (40% ou 20%) são depositados na conta vinculada do trabalhador na Caixa Econômica Federal e sacados separadamente.',
    },
    {
      question: 'Qual o prazo legal para o pagamento das verbas rescisórias?',
      answer:
        'Conforme o Art. 477, § 6º da CLT, o pagamento de todas as verbas rescisórias deve ser efetuado em até 10 (dez) dias corridos contados do término do contrato de trabalho.',
    },
    {
      question: 'Por que o valor real do acerto pode ser diferente do resultado estimado?',
      answer:
        'O valor real pode variar devido a convenções coletivas de trabalho, médias exatas de horas extras ou comissões, faltas injustificadas, vales/adiantamentos, plano de saúde e adicionais específicos previstos no contrato.',
    },
  ];

  const methodology = (
    <>
      <p>
        O cálculo das verbas rescisórias é realizado com base nas disposições da Consolidação das Leis do Trabalho (CLT), da Lei nº 12.506/2011 (aviso prévio proporcional) e das tabelas fiscais vigentes para o ano de 2026:
      </p>
      <div className="p-4 rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-800 text-center my-3 overflow-x-auto">
        Líquido TRCT = (Saldo Salário + Aviso Prévio + 13º Prop. + Férias + 1/3) - (INSS + IRRF + Descontos)
      </div>
      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
        <li><strong>Saldo de Salário:</strong> Calculado com base nos dias trabalhados no mês da demissão (salário ÷ 30 × dias).</li>
        <li><strong>Aviso Prévio Proporcional:</strong> 30 dias base + 3 dias por ano completo de serviço (Lei 12.506/2011, máximo 90 dias).</li>
        <li><strong>Projeção no Tempo de Serviço:</strong> O aviso prévio indenizado projeta a data de término do contrato para contagem de avos de 13º e férias (OJ 82 SDI-1/TST).</li>
        <li><strong>13º e Férias Proporcionais:</strong> Calculados pela fração de 15 dias ou mais de trabalho no período (1/12 por mês).</li>
        <li><strong>Tabelas Fiscais 2026:</strong> INSS apurado pela tabela progressiva oficial (teto R$ 988,09) e IRRF com isenção ampliada até R$ 5.000,00 (Lei nº 15.270/2025).</li>
      </ul>
      <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
        Os valores informados são processados localmente no seu navegador. Os resultados são estimativas educativas e informativas baseadas nos dados fornecidos pelo usuário.
      </p>
    </>
  );

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <CalculatorTemplate
        calculator={calculator}
        breadcrumbs={breadcrumbs}
        introduction="Simule os valores estimados da sua rescisão de contrato de trabalho CLT conforme a modalidade de desligamento."
        methodologyTitle="Como é calculada a rescisão trabalhista?"
        methodology={methodology}
        examples={examples}
        faqs={faqs}
        disclaimer="Esta ferramenta possui finalidade estritamente informativa e educativa. Os resultados são estimativas baseadas nos dados inseridos pelo usuário e nas regras gerais da CLT, não substituindo o Termo de Rescisão de Contrato de Trabalho (TRCT) oficial nem parecer pericial ou jurídico formal."
      >
        <RescisaoCLTCalculator initialSearchParams={searchParams} />
      </CalculatorTemplate>
    </>
  );
}
