/**
 * Componente ComingSoon - Tech Challenge POSTECH
 * Placeholder para funcionalidades em desenvolvimento
 */

'use client';

import React from 'react';
import { Icon } from '@iconify/react';

interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: string;
  features?: string[];
  className?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description = "Esta funcionalidade está sendo desenvolvida e estará disponível em breve.",
  icon = "mdi:rocket-launch",
  features = [],
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] p-8 ${className}`}>
      <div className="text-center max-w-md">
        {/* Ícone principal */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <Icon 
              icon={icon} 
              className="w-10 h-10 text-blue-600" 
            />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>

        {/* Descrição */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Lista de funcionalidades (se fornecida) */}
        {features.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Funcionalidades Planejadas
            </h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-center text-sm text-gray-600"
                >
                  <Icon 
                    icon="mdi:check-circle" 
                    className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" 
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Badge de status */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Icon icon="mdi:clock-outline" className="w-3 h-3 mr-1" />
          Em Desenvolvimento
        </div>

        {/* Decoração */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Componentes específicos para cada seção
export const InvestmentsComingSoon: React.FC = () => (
  <ComingSoon
    title="Investimentos"
    description="Gerencie seus investimentos, acompanhe rentabilidade e diversifique sua carteira com nossa plataforma integrada."
    icon="mdi:trending-up"
    features={[
      "Carteira de investimentos",
      "Análise de rentabilidade",
      "Recomendações personalizadas",
      "Acompanhamento de mercado",
      "Relatórios detalhados"
    ]}
  />
);

export const OtherServicesComingSoon: React.FC = () => (
  <ComingSoon
    title="Outros Serviços"
    description="Descubra uma gama completa de serviços financeiros para facilitar sua vida financeira."
    icon="mdi:apps"
    features={[
      "Pagamento de contas",
      "Transferências PIX",
      "Cartão de crédito virtual",
      "Empréstimos pessoais",
      "Seguros e proteção"
    ]}
  />
);
