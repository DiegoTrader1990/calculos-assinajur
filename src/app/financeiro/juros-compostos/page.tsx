import { Metadata } from 'next';
import CalculatorTemplate, { ExampleItem, FAQItem } from '@/components/CalculatorTemplate';
import JurosCompostosCalculator from '@/components/calculators/JurosCompostos';
import { getCalculatorBySlug } from '@/data/calculators';
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

export default function JurosCompostosPage() {
  const calculator = getCalculatorBySlug('financeiro', 'juros-compostos');

  if (!calculator) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Financeiro', href: '/financeiro' },
    { label: 'Calculadora de Juros Compostos' },
  ];

  const examples: ExampleItem[] = [
    {
      title: 'Exemplo Prático: R$ 1.000 Inicial + R$ 300/mês a 1% a.m. por 5 Anos',
      description: 'Aplicação inicial de R$ 1.000,00 com aportes mensais consecutivos de R$ 300,00 durante 60 meses a uma taxa de 1% ao mês (aprox. 12,68% a.a.).',
      result: 'Total Investido: R$ 19.000,00 | Juros Ganhos: R$ 7.317,60 | Saldo Final: R$ 26.317,60',
    },
    {
      title: 'Exemplo de Depósito Único: R$ 5.000 sem aportes por 10 Anos',
      description: 'Aplicação única sem acréscimos mensais durante 120 meses a uma taxa de 0,8% ao mês (aprox. 10% a.a.).',
      result: 'Total Investido: R$ 5.000,00 | Juros Ganhos: R$ 7.994,88 | Saldo Final: R$ 12.994,88',
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
        'Nos juros simples, a taxa incide sempre e apenas sobre o valor inicial investido. Nos juros compostos, a taxa incide sobre o saldo total atualizado (capital inicial + juros acumulados até o mês anterior).',
    },
    {
      question: 'Como funciona a regra do aporte mensal nesta calculadora?',
      answer:
        'Os aportes mensais são considerados efetuados ao final de cada período (aportes postcipados). Isso significa que o aporte do mês atual passa a render juros a partir do mês seguinte.',
    },
    {
      question: 'A taxa anual é dividida por 12 ao alternar para a.m.?',
      answer:
        'Não. Ao selecionar a taxa ao ano (a.a.), a calculadora utiliza a equivalência matemática de taxas compostas: i_mensal = (1 + i_anual)^(1/12) - 1. Isso garante exatidão em investimentos como Tesouro Direto e CDBs.',
    },
    {
      question: 'O resultado considera imposto de renda ou taxas de custódia?',
      answer:
        'Não. Esta calculadora realiza a simulação do rendimento bruto nominal. Para apurar o valor líquido final de ativos tributáveis, deve-se descontar a alíquota de IR e eventuais taxas da corretora.',
    },
    {
      question: 'O resultado representa garantia de rentabilidade?',
      answer:
        'Não. O cálculo é uma simulação matemática projetada com base estritamente na taxa e prazos informados pelo usuário. Rendimentos futuros de investimentos reais podem variar conforme o mercado.',
    },
  ];

  const methodology = (
    <>
      <p className="font-semibold text-slate-800">
        Como calculamos os juros compostos?
      </p>
      <p>
        O cálculo utiliza a fórmula clássica de capitalização composta somada à série de pagamentos uniformes (aportes periódicos ao final de cada mês):
      </p>
      <div className="p-4 rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-800 text-center my-3 overflow-x-auto">
        Montante Final = P × (1 + i)^n + PMT × [ ((1 + i)^n - 1) / i ]
      </div>
      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
        <li><strong>P (Principal):</strong> Valor inicial aplicado no início do contrato.</li>
        <li><strong>PMT (Aporte):</strong> Valor depositado mensalmente ao final do período (postcipado).</li>
        <li><strong>i (Taxa de Juros):</strong> Taxa de juros mensal equivalente. Quando inserida ao ano, é convertida por equivalência composta: <code className="bg-slate-200 px-1 py-0.5 rounded">i_m = (1 + i_a)^(1/12) - 1</code>.</li>
        <li><strong>n (Período):</strong> Número total de meses da simulação.</li>
      </ul>
      <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
        Nota: Os resultados dependem exclusivamente dos valores inseridos pelo usuário no formulário acima.
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
        introduction="Calcule a evolução do seu dinheiro ao longo do tempo. Simule o valor inicial, depósitos mensais regulares e veja a composição do seu patrimônio com a tabela periódica."
        methodology={methodology}
        examples={examples}
        faqs={faqs}
        disclaimer="Esta ferramenta possui finalidade informativa e educacional. Os resultados são estimativas baseadas nos dados informados pelo usuário e não representam garantia de rentabilidade ou recomendação de investimento."
      >
        <JurosCompostosCalculator />
      </CalculatorTemplate>
    </>
  );
}
