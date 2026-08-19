import { Metadata } from 'next';
import CalculatorTemplate, { ExampleItem, FAQItem } from '@/components/CalculatorTemplate';
import JurosCompostosCalculator from '@/components/calculators/JurosCompostos';
import { getCalculatorBySlug } from '@/data/calculators';
import { calculateJurosCompostos, formatBRL } from '@/lib/calculators/juros-compostos';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Calculadora de Juros Compostos com Aportes Mensais',
  description: 'Simule o crescimento do seu patrimônio com a calculadora de juros compostos. Calcule rendimentos, aportes mensais, equivalência de taxas e gráfico de evolução.',
  alternates: {
    canonical: 'https://calculos.assinajur.com.br/financeiro/juros-compostos',
  },
  openGraph: {
    title: 'Calculadora de Juros Compostos — Simulador Gratuito',
    description: 'Descubra quanto seu dinheiro pode render no tempo com juros compostos e aportes mensais.',
    url: 'https://calculos.assinajur.com.br/financeiro/juros-compostos',
    type: 'website',
  },
};

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function JurosCompostosPage({ searchParams }: PageProps) {
  const calculator = getCalculatorBySlug('financeiro', 'juros-compostos');

  if (!calculator) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Financeiro', href: '/financeiro' },
    { label: 'Calculadora de Juros Compostos' },
  ];

  // EXEMPLOS MATEMÁTICOS CALCULADOS DINAMICAMENTE PELA MESMA ENGINE CENTRAL
  const ex1Result = calculateJurosCompostos({
    valorInicial: 1000,
    aporteMensal: 300,
    taxaJuros: 1,
    tipoTaxa: 'mensal',
    periodo: 5,
    tipoPeriodo: 'anos',
  });

  const ex2Result = calculateJurosCompostos({
    valorInicial: 5000,
    aporteMensal: 0,
    taxaJuros: 0.8,
    tipoTaxa: 'mensal',
    periodo: 10,
    tipoPeriodo: 'anos',
  });

  const examples: ExampleItem[] = [
    {
      title: 'Exemplo 1: R$ 1.000 Inicial + R$ 300/mês a 1% a.m. por 5 Anos (60 Meses)',
      description: 'Aplicação inicial de R$ 1.000,00 com aportes mensais postcipados de R$ 300,00 a uma taxa de 1% ao mês.',
      result: `Total Investido: ${formatBRL(ex1Result.totalInvested)} | Juros Ganhos: ${formatBRL(ex1Result.totalInterest)} | Saldo Final: ${formatBRL(ex1Result.totalFinal)}`,
    },
    {
      title: 'Exemplo 2: Aplicação Única de R$ 5.000 sem Aportes por 10 Anos (120 Meses)',
      description: 'Depósito inicial único sem novos aportes mensais a uma taxa de 0,8% ao mês.',
      result: `Total Investido: ${formatBRL(ex2Result.totalInvested)} | Juros Ganhos: ${formatBRL(ex2Result.totalInterest)} | Saldo Final: ${formatBRL(ex2Result.totalFinal)}`,
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'O que são juros compostos?',
      answer:
        'Juros compostos são os "juros sobre juros". Nessa modalidade, o rendimento gerado em cada período é somado ao capital acumulado para calcular os juros do período seguinte, gerando crescimento exponencial.',
    },
    {
      question: 'Qual a diferença entre juros simples e compostos?',
      answer:
        'Nos juros simples, a taxa incide sempre e apenas sobre o valor inicial investido. Nos juros compostos, a taxa incide sobre o saldo total acumulado (capital inicial + juros dos meses anteriores).',
    },
    {
      question: 'Como funciona a regra do aporte mensal nesta calculadora?',
      answer:
        'Os aportes mensais são considerados efetuados ao final de cada período (postcipados). Isso significa que o aporte do mês atual passa a render juros a partir do mês seguinte.',
    },
    {
      question: 'A taxa anual é dividida por 12 ao alternar para a.m.?',
      answer:
        'Não. Ao selecionar a taxa ao ano (a.a.), a calculadora utiliza a equivalência matemática composta: i_mensal = (1 + i_anual)^(1/12) - 1. Isso mantém a equivalência matemática entre as taxas utilizadas na simulação.',
    },
    {
      question: 'O resultado considera imposto de renda ou taxas?',
      answer:
        'Não. Esta calculadora realiza a simulação do rendimento bruto nominal. Para apurar o valor líquido de ativos tributáveis, deve-se descontar a alíquota de IR e eventuais custos operacionais.',
    },
    {
      question: 'O resultado representa garantia de rendimento?',
      answer:
        'Não. O cálculo é uma simulação matemática projetada com base estritamente nos dados informados pelo usuário. Rendimentos futuros de aplicações reais dependem das condições de mercado.',
    },
  ];

  const methodology = (
    <>
      <p>
        O cálculo utiliza a fórmula de capitalização composta somada à série de pagamentos uniformes com aportes no final de cada mês (postcipados):
      </p>
      <div className="p-4 rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-800 text-center my-3 overflow-x-auto">
        Montante Final = P × (1 + i)^n + PMT × [ ((1 + i)^n - 1) / i ]
      </div>
      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
        <li><strong>P (Principal):</strong> Valor inicial aplicado no início do contrato.</li>
        <li><strong>PMT (Aporte):</strong> Valor depositado mensalmente ao final de cada período.</li>
        <li><strong>i (Taxa de Juros):</strong> Taxa de juros mensal equivalente. Ao selecionar ao ano, a taxa é convertida por equivalência composta: <code className="bg-slate-200 px-1 rounded">i_m = (1 + i_a)^(1/12) - 1</code>.</li>
        <li><strong>n (Período):</strong> Número total de meses da simulação.</li>
      </ul>
      <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
        Os valores informados nesta calculadora são processados localmente no seu navegador. Os resultados são estimativas baseadas nos dados fornecidos pelo usuário.
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
        introduction="Simule aportes, juros e veja como seu patrimônio pode evoluir ao longo do tempo."
        methodologyTitle="Como calculamos os juros compostos?"
        methodology={methodology}
        examples={examples}
        faqs={faqs}
        disclaimer="Esta ferramenta possui finalidade informativa e educacional. Os resultados são estimativas baseadas nos dados informados pelo usuário e não representam garantia de rentabilidade ou recomendação de investimento."
      >
        <JurosCompostosCalculator initialSearchParams={searchParams} />
      </CalculatorTemplate>
    </>
  );
}
