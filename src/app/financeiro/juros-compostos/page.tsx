import { Metadata } from 'next';
import CalculatorTemplate, { ExampleItem, FAQItem } from '@/components/CalculatorTemplate';
import JurosCompostosCalculator from '@/components/calculators/JurosCompostos';
import { getCalculatorBySlug } from '@/data/calculators';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Calculadora de Juros Compostos com Aportes Mensais',
  description: 'Simule o crescimento do seu patrimônio com a calculadora de juros compostos. Calcule rendimento, aportes periódicos, taxas mensais/anuais e tabela comparativa.',
  alternates: {
    canonical: 'https://calculos.assinajur.com.br/financeiro/juros-compostos',
  },
  openGraph: {
    title: 'Calculadora de Juros Compostos - Simulador Gratuito',
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
    { label: 'Financeiro', href: '/#categorias' },
    { label: 'Calculadora de Juros Compostos' },
  ];

  const examples: ExampleItem[] = [
    {
      title: 'Exemplo 1: Investimento Inicial de R$ 1.000 + R$ 300/mês por 5 Anos',
      description: 'Taxa de juros de 1% ao mês (aprox. 12,68% a.a.) mantida por 60 meses.',
      result: 'Total investido: R$ 19.000,00 | Juros ganhos: R$ 6.326,20 | Saldo final: R$ 25.326,20',
    },
    {
      title: 'Exemplo 2: Reserva de R$ 5.000 sem aportes adicionais por 10 Anos',
      description: 'Aplicação única com rentabilidade líquida de 0,8% ao mês (aprox. 10% a.a.).',
      result: 'Total investido: R$ 5.000,00 | Juros ganhos: R$ 7.994,88 | Saldo final: R$ 12.994,88',
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'O que são juros compostos?',
      answer:
        'Juros compostos são os "juros sobre juros". Nessa modalidade, o rendimento de cada período é somado ao montante principal para calcular os juros do período seguinte, gerando crescimento exponencial do capital.',
    },
    {
      question: 'Qual a diferença entre taxa ao mês (a.m.) e ao ano (a.a.)?',
      answer:
        'A taxa mensal (a.m.) é aplicada a cada 30 dias. Por conta da capitalização composta, uma taxa de 1% a.m. equivale a aproximadamente 12,68% ao ano (e não 12% simples).',
    },
    {
      question: 'Como os aportes mensais influenciam no resultado?',
      answer:
        'Os aportes mensais aceleram significativamente o acúmulo de patrimônio, pois cada novo valor investido passa a render juros a partir do mês em que é depositado.',
    },
  ];

  const methodology = (
    <>
      <p>
        A fórmula fundamental dos juros compostos para um valor inicial único é dada por:
      </p>
      <div className="p-4 rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-800 text-center my-2">
        M = P × (1 + i)^n
      </div>
      <p>
        Onde <strong>M</strong> é o montante final, <strong>P</strong> é o capital inicial, <strong>i</strong> é a taxa de juros no período e <strong>n</strong> é o número de períodos.
      </p>
      <p>
        Quando ocorrem aportes periódicos regulares (PMT), a fórmula do valor futuro de uma série de pagamentos é somada ao montante acumulado:
      </p>
      <div className="p-4 rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-800 text-center my-2">
        VF = P × (1 + i)^n + PMT × [ ((1 + i)^n - 1) / i ]
      </div>
      <p>
        Esta calculadora executa o cálculo mês a mês em tempo real, garantindo precisão matemática exata e demonstrando a evolução na tabela periódica.
      </p>
    </>
  );

  return (
    <CalculatorTemplate
      calculator={calculator}
      breadcrumbs={breadcrumbs}
      introduction="Calcule o impacto do tempo e dos juros compostos no seu dinheiro. Simule o valor inicial, depósitos mensais regulares e veja o gráfico de composição do seu patrimônio."
      methodology={methodology}
      examples={examples}
      faqs={faqs}
    >
      <JurosCompostosCalculator />
    </CalculatorTemplate>
  );
}
