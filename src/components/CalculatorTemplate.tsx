import React from 'react';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import { CalculatorItem } from '@/data/calculators';
import { Calendar, ShieldAlert, HelpCircle, BookOpen, CheckCircle2 } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ExampleItem {
  title: string;
  description: string;
  result: string;
}

interface CalculatorTemplateProps {
  calculator: CalculatorItem;
  breadcrumbs: BreadcrumbItem[];
  introduction: string;
  methodology: React.ReactNode;
  examples?: ExampleItem[];
  faqs?: FAQItem[];
  disclaimer?: string;
  children: React.ReactNode;
}

export default function CalculatorTemplate({
  calculator,
  breadcrumbs,
  introduction,
  methodology,
  examples,
  faqs,
  disclaimer = 'Os resultados fornecidos por esta calculadora são simulações matemáticas para fins informativos e educativos. Não constituem aconselhamento legal, fiscal ou financeiro formal.',
  children
}: CalculatorTemplateProps) {
  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header Title & Badges */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-3 py-1 rounded-md">
              {calculator.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Confiável & Gratuito
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            {calculator.name}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed font-normal max-w-3xl">
            {introduction}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-400 gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Última atualização: {new Date(calculator.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Calculation Interactive Form & Results Slot */}
        <div className="mb-12">
          {children}
        </div>

        {/* Methodology & Formula Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Como funciona o cálculo e metodologia
            </h2>
          </div>
          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-3">
            {methodology}
          </div>
        </section>

        {/* Practical Examples */}
        {examples && examples.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Exemplos Práticos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examples.map((ex, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{ex.title}</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">{ex.description}</p>
                  <div className="p-2.5 rounded-lg bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200/60">
                    Resultado: {ex.result}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Perguntas Frequentes (FAQ)
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">{faq.question}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer Notice */}
        {disclaimer && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Aviso Legal & Isenção de Responsabilidade:</strong> {disclaimer}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
