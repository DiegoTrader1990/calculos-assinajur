import { MetadataRoute } from 'next';
import { CALCULATORS_REGISTRY, CALCULATOR_CATEGORIES } from '@/data/calculators';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculos.assinajur.com.br';

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Add Categories
  CALCULATOR_CATEGORIES.forEach((cat) => {
    routes.push({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Add Calculators
  CALCULATORS_REGISTRY.forEach((calc) => {
    if (calc.status === 'active') {
      routes.push({
        url: `${baseUrl}/${calc.categorySlug}/${calc.slug}`,
        lastModified: new Date(calc.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  });

  return routes;
}
