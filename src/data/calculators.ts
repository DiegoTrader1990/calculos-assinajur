export interface CalculatorItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  keywords: string[];
  aliases: string[];
  icon: string;
  featured: boolean;
  popular: boolean;
  status: 'active' | 'coming_soon';
  updatedAt: string;
  path: string;
}

export interface CalculatorCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  {
    id: 'financeiro',
    name: 'Financeiro',
    slug: 'financeiro',
    description: 'Investimentos, juros compostos, rentabilidade, simulações de acúmulo de patrimônio e finanças pessoais.',
    icon: 'TrendingUp',
    color: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'trabalhista',
    name: 'Trabalhista',
    slug: 'trabalhista',
    description: 'Cálculo de rescisão contratual CLT, saldo de salário, aviso prévio, férias, 13º salário e FGTS.',
    icon: 'Briefcase',
    color: 'from-blue-500 to-indigo-700'
  },
  {
    id: 'previdenciario',
    name: 'Previdenciário',
    slug: 'previdenciario',
    description: 'Simulações do INSS, estimativa de aposentadoria por tempo ou idade, RMI e benefícios sociais.',
    icon: 'ShieldCheck',
    color: 'from-amber-500 to-orange-700'
  },
  {
    id: 'juridico',
    name: 'Jurídico',
    slug: 'juridico',
    description: 'Atualização monetária de débitos judiciais, IPCA-E, SELIC, Tabela TJSP, honorários e cumprimento de sentença.',
    icon: 'Scale',
    color: 'from-violet-500 to-purple-700'
  },
  {
    id: 'imobiliario',
    name: 'Imobiliário',
    slug: 'imobiliario',
    description: 'Simulador de financiamento imobiliário (SAC e Price), reajuste de aluguel (IGP-M/IPCA) e ITBI.',
    icon: 'Home',
    color: 'from-cyan-500 to-blue-700'
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    slug: 'empresarial',
    description: 'Margem de lucro, cálculo de Markup, ponto de equilíbrio e tributação para micro e pequenas empresas.',
    icon: 'Building2',
    color: 'from-rose-500 to-red-700'
  }
];

export const CALCULATORS_REGISTRY: CalculatorItem[] = [
  {
    id: 'juros-compostos',
    name: 'Calculadora de Juros Compostos',
    slug: 'juros-compostos',
    category: 'Financeiro',
    categorySlug: 'financeiro',
    shortDescription: 'Calcule a evolução do seu patrimônio com aportes mensais e juros compostos em tempo real.',
    keywords: ['juros compostos', 'investimentos', 'simulador financeiro', 'rentabilidade', 'aporte mensal', 'tesouro direto', 'cdb', 'poupança'],
    aliases: ['juros', 'investimento', 'render', 'rentabilidade', 'ganho', 'patrimônio', 'aporte', 'poupar', 'rico'],
    icon: 'Coins',
    featured: true,
    popular: true,
    status: 'active',
    updatedAt: '2026-08-19',
    path: '/financeiro/juros-compostos'
  },
  {
    id: 'rescisao-clt',
    name: 'Calculadora de Rescisão Trabalhista',
    slug: 'rescisao',
    category: 'Trabalhista',
    categorySlug: 'trabalhista',
    shortDescription: 'Simule o valor estimado a receber na demissão sem justa causa, pedido, acordo ou término de contrato.',
    keywords: ['rescisão', 'clt', 'demissão', 'fgts', 'aviso prévio', 'férias', '13 salário', 'trabalho', 'acerto', 'quanto vou receber'],
    aliases: ['demissão', 'demitido', 'acordo', 'sair do emprego', 'acerto', 'acerto trabalhista', 'verbas rescisórias', 'aviso prévio', 'demitida', 'fui demitido', 'pedido de demissão', 'desligamento'],
    icon: 'FileText',
    featured: true,
    popular: true,
    status: 'active',
    updatedAt: '2026-08-19',
    path: '/trabalhista/rescisao'
  },
  {
    id: 'atualizacao-monetaria',
    name: 'Atualização Monetária & Juros',
    slug: 'atualizacao-monetaria',
    category: 'Jurídico',
    categorySlug: 'juridico',
    shortDescription: 'Corrija valores judiciais pelos índices IPCA-E, INPC, SELIC e Tabela Prática do TJSP.',
    keywords: ['correção monetária', 'ipca-e', 'inpc', 'selic', 'tjsp', 'débito judicial', 'juros moratórios', 'processo'],
    aliases: ['correção', 'atualizar valor', 'inflação', 'selic', 'processo', 'dívida judicial', 'tjsp', 'indexador'],
    icon: 'Scale',
    featured: true,
    popular: true,
    status: 'coming_soon',
    updatedAt: '2026-08-19',
    path: '/juridico/atualizacao-monetaria'
  },
  {
    id: 'aposentadoria-rmi',
    name: 'Simulador de Aposentadoria (RMI)',
    slug: 'aposentadoria-rmi',
    category: 'Previdenciário',
    categorySlug: 'previdenciario',
    shortDescription: 'Estime o valor da Renda Mensal Inicial e regras de transição do INSS.',
    keywords: ['inss', 'aposentadoria', 'rmi', 'regras de transição', 'tempo de contribuição', 'previdência'],
    aliases: ['aposentar', 'aposentado', 'idade', 'contribuição', 'inss', 'benefício', 'tempo de serviço'],
    icon: 'ShieldCheck',
    featured: false,
    popular: false,
    status: 'coming_soon',
    updatedAt: '2026-08-19',
    path: '/previdenciario/aposentadoria-rmi'
  },
  {
    id: 'financiamento-imobiliario',
    name: 'Financiamento Imobiliário (SAC / Price)',
    slug: 'financiamento-imobiliario',
    category: 'Imobiliário',
    categorySlug: 'imobiliario',
    shortDescription: 'Compare amortização pelo sistema SAC e Tabela Price para compra de imóvel.',
    keywords: ['financiamento', 'imóvel', 'sac', 'price', 'parcela', 'amortização', 'casa própria', 'apartamento'],
    aliases: ['casa', 'imovel', 'parcela', 'caixa', 'prestação', 'comprar casa', 'financiar', 'aluguel ou compra'],
    icon: 'Home',
    featured: false,
    popular: false,
    status: 'coming_soon',
    updatedAt: '2026-08-19',
    path: '/imobiliario/financiamento-imobiliario'
  },
  {
    id: 'margem-lucro-markup',
    name: 'Margem de Lucro & Markup',
    slug: 'margem-lucro-markup',
    category: 'Empresarial',
    categorySlug: 'empresarial',
    shortDescription: 'Calcule o preço ideal de venda de produtos e serviços garantindo sua margem de lucro.',
    keywords: ['markup', 'margem de lucro', 'preço de venda', 'gestão financeira', 'custo', 'empresa'],
    aliases: ['lucro', 'vender', 'preço', 'precificação', 'produto', 'serviço', 'custos', 'ganho bruto'],
    icon: 'Building2',
    featured: false,
    popular: false,
    status: 'coming_soon',
    updatedAt: '2026-08-19',
    path: '/empresarial/margem-lucro-markup'
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

export function getPopularCalculators(): CalculatorItem[] {
  return CALCULATORS_REGISTRY.filter(c => c.popular);
}

export function searchCalculators(query: string, categoryFilter: string = 'all'): CalculatorItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  
  return CALCULATORS_REGISTRY.filter((calc) => {
    const matchesCategory =
      categoryFilter === 'all' || calc.categorySlug.toLowerCase() === categoryFilter.toLowerCase();

    if (!normalizedQuery) return matchesCategory;

    const matchesName = calc.name.toLowerCase().includes(normalizedQuery);
    const matchesCategoryName = calc.category.toLowerCase().includes(normalizedQuery);
    const matchesDescription = calc.shortDescription.toLowerCase().includes(normalizedQuery);
    const matchesKeywords = calc.keywords.some((k) => k.toLowerCase().includes(normalizedQuery));
    const matchesAliases = calc.aliases.some((a) => a.toLowerCase().includes(normalizedQuery));

    return matchesCategory && (matchesName || matchesCategoryName || matchesDescription || matchesKeywords || matchesAliases);
  });
}
