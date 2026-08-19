export interface CalculatorItem {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  keywords: string[];
  icon: string;
  updatedAt: string;
  status: 'active' | 'coming_soon';
  featured: boolean;
}

export interface CalculatorCategory {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  {
    name: 'Financeiro',
    slug: 'financeiro',
    description: 'Investimentos, juros, rentabilidade, câmbio e rendimento acumulado.',
    icon: 'TrendingUp',
    color: 'from-emerald-500 to-teal-700'
  },
  {
    name: 'Trabalhista',
    slug: 'trabalhista',
    description: 'Rescisão contratual, horas extras, FGTS, férias, 13º e adicionais.',
    icon: 'Briefcase',
    color: 'from-blue-500 to-indigo-700'
  },
  {
    name: 'Previdenciário',
    slug: 'previdenciario',
    description: 'Simulação de aposentadoria, tempo de contribuição, RMI e benefícios.',
    icon: 'ShieldCheck',
    color: 'from-amber-500 to-orange-700'
  },
  {
    name: 'Jurídico',
    slug: 'juridico',
    description: 'Atualização monetária, honorários sucumbenciais, custas e execução.',
    icon: 'Scale',
    color: 'from-violet-500 to-purple-700'
  },
  {
    name: 'Imobiliário',
    slug: 'imobiliario',
    description: 'Simulação de financiamentos (SAC/Price), aluguel e ITBI.',
    icon: 'Home',
    color: 'from-cyan-500 to-blue-700'
  },
  {
    name: 'Empresarial',
    slug: 'empresarial',
    description: 'Margem de lucro, ponto de equilíbrio, tributos e valuation inicial.',
    icon: 'Building2',
    color: 'from-rose-500 to-red-700'
  }
];

export const CALCULATORS_REGISTRY: CalculatorItem[] = [
  {
    name: 'Calculadora de Juros Compostos',
    slug: 'juros-compostos',
    category: 'Financeiro',
    categorySlug: 'financeiro',
    shortDescription: 'Calcule a evolução do seu patrimônio com aportes mensais e juros compostos em tempo real.',
    keywords: ['juros compostos', 'investimentos', 'simulador financeiro', 'rentabilidade', 'aporte mensal', 'tesouro direto'],
    icon: 'Coins',
    updatedAt: '2026-08-19',
    status: 'active',
    featured: true
  },
  {
    name: 'Calculadora de Rescisão CLT',
    slug: 'rescisao-clt',
    category: 'Trabalhista',
    categorySlug: 'trabalhista',
    shortDescription: 'Simule o valor a receber na demissão sem justa causa, pedido ou acordo mútuo.',
    keywords: ['rescisão', 'clt', 'demissão', 'fgts', 'aviso prévio', 'férias', '13 salário'],
    icon: 'FileText',
    updatedAt: '2026-08-19',
    status: 'coming_soon',
    featured: true
  },
  {
    name: 'Atualização Monetária & Juros',
    slug: 'atualizacao-monetaria',
    category: 'Jurídico',
    categorySlug: 'juridico',
    shortDescription: 'Corrija valores judiciais pelos índices IPCA-E, INPC, SELIC e Tabela Prática do TJSP.',
    keywords: ['correção monetária', 'ipca-e', 'inpc', 'selic', 'tjsp', 'débito judicial', 'juros moratórios'],
    icon: 'Scale',
    updatedAt: '2026-08-19',
    status: 'coming_soon',
    featured: true
  },
  {
    name: 'Simulador de Aposentadoria (RMI)',
    slug: 'aposentadoria-rmi',
    category: 'Previdenciário',
    categorySlug: 'previdenciario',
    shortDescription: 'Estime o valor da Renda Mensal Inicial e regras de transição do INSS.',
    keywords: ['inss', 'aposentadoria', 'rmi', 'regras de transição', 'tempo de contribuição'],
    icon: 'ShieldCheck',
    updatedAt: '2026-08-19',
    status: 'coming_soon',
    featured: false
  },
  {
    name: 'Financiamento Imobiliário (SAC / Price)',
    slug: 'financiamento-imobiliario',
    category: 'Imobiliário',
    categorySlug: 'imobiliario',
    shortDescription: 'Compare amortização pelo sistema SAC e Tabela Price para compra de imóvel.',
    keywords: ['financiamento', 'imóvel', 'sac', 'price', 'parcela', 'amortização'],
    icon: 'Home',
    updatedAt: '2026-08-19',
    status: 'coming_soon',
    featured: false
  },
  {
    name: 'Margem de Lucro & Markup',
    slug: 'margem-lucro-markup',
    category: 'Empresarial',
    categorySlug: 'empresarial',
    shortDescription: 'Calcule o preço ideal de venda de produtos e serviços garantindo sua margem.',
    keywords: ['markup', 'margem de lucro', 'preço de venda', 'gestão financeira', 'custo'],
    icon: 'Building2',
    updatedAt: '2026-08-19',
    status: 'coming_soon',
    featured: false
  }
];

export function getCalculatorBySlug(categorySlug: string, slug: string): CalculatorItem | undefined {
  return CALCULATORS_REGISTRY.find(
    c => c.categorySlug.toLowerCase() === categorySlug.toLowerCase() && c.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorItem[] {
  return CALCULATORS_REGISTRY.filter(
    c => c.categorySlug.toLowerCase() === categorySlug.toLowerCase()
  );
}

export function getFeaturedCalculators(): CalculatorItem[] {
  return CALCULATORS_REGISTRY.filter(c => c.featured);
}
