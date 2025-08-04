import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import moment from "moment";
moment.locale("pt-BR");

// Mapeamento de categorias com ícones e cores
const CATEGORY_CONFIG = {
  'Alimentação': { icon: 'mdi:food', color: 'text-orange-600', bg: 'bg-orange-100' },
  'Transporte': { icon: 'mdi:car', color: 'text-blue-600', bg: 'bg-blue-100' },
  'Moradia': { icon: 'mdi:home', color: 'text-green-600', bg: 'bg-green-100' },
  'Saúde': { icon: 'mdi:medical-bag', color: 'text-red-600', bg: 'bg-red-100' },
  'Educação': { icon: 'mdi:school', color: 'text-purple-600', bg: 'bg-purple-100' },
  'Lazer': { icon: 'mdi:gamepad-variant', color: 'text-pink-600', bg: 'bg-pink-100' },
  'Compras': { icon: 'mdi:shopping', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  'Investimentos': { icon: 'mdi:trending-up', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  'Salário': { icon: 'mdi:cash', color: 'text-green-700', bg: 'bg-green-100' },
  'Freelance': { icon: 'mdi:laptop', color: 'text-blue-700', bg: 'bg-blue-100' },
  'Outros': { icon: 'mdi:dots-horizontal', color: 'text-gray-600', bg: 'bg-gray-100' }
} as const;

type TransactionCardProps = {
  id?: string;
  type: string;
  date: string | Date;
  value: number;
  category?: string;
  description?: string;
  editable?: boolean;
  deleteTransaction?: () => Promise<void>;
  editTransaction?: () => void;
};

export const TransactionCard = ({
  id,
  type,
  date,
  value,
  category = 'Outros',
  description,
  editable = false,
  deleteTransaction,
  editTransaction,
}: TransactionCardProps) => {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);

  const categoryConfig = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG['Outros'];
  const isIncome = value > 0;
  const transactionType = isIncome ? 'Receita' : 'Despesa';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header com categoria e tipo */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Ícone da categoria */}
          <div className={`p-2 rounded-lg ${categoryConfig.bg}`}>
            <Icon 
              icon={categoryConfig.icon} 
              className={`w-5 h-5 ${categoryConfig.color}`} 
            />
          </div>
          
          {/* Categoria e tipo */}
          <div>
            <div className="text-sm font-medium text-gray-900">{category}</div>
            <div className="text-xs text-gray-500">{transactionType}</div>
          </div>
        </div>

        {/* Valor */}
        <div className="text-right">
          <div
            className={clsx(
              "text-lg font-bold",
              isIncome ? "text-green-600" : "text-red-600"
            )}
          >
            {isIncome ? '+' : ''}{formattedValue}
          </div>
          <div className="text-xs text-gray-500">
            {moment(date).format("DD/MM/YYYY")}
          </div>
        </div>
      </div>

      {/* Descrição */}
      {description && (
        <div className="mb-3">
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        </div>
      )}

      {/* Footer com ID e ações */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {/* Tipo da transação */}
          <span className={clsx(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            isIncome 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          )}>
            {type}
          </span>
          
          {/* ID da transação */}
          {id && (
            <span className="text-xs text-gray-400 font-mono">
              #{id.slice(-6)}
            </span>
          )}
        </div>

        {/* Ações */}
        {editable && (
          <div className="flex items-center space-x-2">
            <button 
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
              onClick={editTransaction}
              title="Editar transação"
            >
              <Icon icon="mdi:pencil" className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
              onClick={deleteTransaction}
              title="Excluir transação"
            >
              <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
