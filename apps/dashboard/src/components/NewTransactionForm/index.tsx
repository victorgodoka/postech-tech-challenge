import React, { useState, useEffect } from "react";
import { addTransaction, updateTransactionById } from "@/lib/api";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Icon } from '@iconify/react';
import moment from "moment";

const today = moment().format("YYYY-MM-DD");

const CATEGORIES = [
  { value: 'Alimentação', label: 'Alimentação', icon: 'mdi:food', color: 'text-orange-600' },
  { value: 'Transporte', label: 'Transporte', icon: 'mdi:car', color: 'text-blue-600' },
  { value: 'Moradia', label: 'Moradia', icon: 'mdi:home', color: 'text-green-600' },
  { value: 'Saúde', label: 'Saúde', icon: 'mdi:medical-bag', color: 'text-red-600' },
  { value: 'Educação', label: 'Educação', icon: 'mdi:school', color: 'text-purple-600' },
  { value: 'Lazer', label: 'Lazer', icon: 'mdi:gamepad-variant', color: 'text-pink-600' },
  { value: 'Compras', label: 'Compras', icon: 'mdi:shopping', color: 'text-indigo-600' },
  { value: 'Investimentos', label: 'Investimentos', icon: 'mdi:trending-up', color: 'text-emerald-600' },
  { value: 'Salário', label: 'Salário', icon: 'mdi:cash', color: 'text-green-700' },
  { value: 'Freelance', label: 'Freelance', icon: 'mdi:laptop', color: 'text-blue-700' },
  { value: 'Outros', label: 'Outros', icon: 'mdi:dots-horizontal', color: 'text-gray-600' }
];

interface TransactionFormData {
  id?: string;
  value: number;
  type: string;
  date: string;
  category?: string;
  description?: string;
}

const NewTransactionForm = ({
  isOpen,
  onClose,
  accountId,
  transaction,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  transaction?: TransactionFormData;
  onSubmit?: (data: TransactionFormData & { accountId: string }) => Promise<void>;
}) => {
  // Inicializar valores corretamente para edição
  const [value, setValue] = useState(() => {
    if (transaction) {
      // O valor vem em centavos do banco, converter para string de centavos para o Input currency
      return Math.abs(transaction.value).toString();
    }
    return "";
  });
  const [type, setType] = useState(transaction ? transaction.type : "Depósito");
  const [date, setDate] = useState(transaction ? transaction.date : today);
  const [category, setCategory] = useState(transaction?.category || 'Outros');
  const [description, setDescription] = useState(transaction?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Atualizar valores quando a transação mudar (para edição)
  useEffect(() => {
    if (transaction) {
      setValue(Math.abs(transaction.value).toString());
      setType(transaction.type);
      setDate(transaction.date);
      setCategory(transaction.category || 'Outros');
      setDescription(transaction.description || '');
    } else {
      // Resetar para nova transação
      setValue("");
      setType("Depósito");
      setDate(today);
      setCategory('Outros');
      setDescription('');
    }
    setError(""); // Limpar erros ao trocar de transação
  }, [transaction]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validações
    // O valor vem em centavos do componente Input currency
    const valueInCents = parseInt(String(value)) || 0;
    if (valueInCents <= 0) {
      setError("Digite um valor válido.");
      setLoading(false);
      return;
    }
    
    // Converter centavos para valor real para validação
    let floatValue = valueInCents / 100;

    if (moment(date).isAfter(today)) {
      setError("A data não pode ser no futuro.");
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      setError("Digite uma descrição para a transação.");
      setLoading(false);
      return;
    }

    // Ajustar valor baseado no tipo (já está em centavos)
    let finalValueInCents = valueInCents;
    if (type === "Saque") finalValueInCents = -valueInCents;

    const transactionData = {
      accountId,
      type,
      value: finalValueInCents,
      date,
      category,
      description: description.trim()
    };

    try {
      if (transaction && transaction.id) {
        // Editando transação existente
        await updateTransactionById(transaction.id, transactionData);
      } else {
        // Criando nova transação
        await addTransaction(transactionData);
      }

      // Resetar formulário
      setValue("");
      setType("Depósito");
      setDate(today);
      setCategory('Outros');
      setDescription('');
      onClose();

      if (onSubmit) {
        await onSubmit({
          ...transactionData,
          id: transaction?.id
        });
      }

    } catch (error) {
      console.error('Erro ao processar transação:', error);
      setError("Erro ao registrar transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/55 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            <Select
              label="Tipo *"
              options={[
                { label: "Depósito", value: "Depósito" },
                { label: "Saque", value: "Saque" },
              ]}
              value={type}
              onChange={setType}
            />
            
            <Input
              id="data"
              label="Data *"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Input
              id="valor"
              label="Valor *"
              placeholder="Ex: 100,00"
              type="currency"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center space-x-2 p-2 rounded-lg border text-sm transition-all ${category === cat.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <Icon icon={cat.icon} className={`w-4 h-4 ${cat.color}`} />
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a transação..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              {description.length}/200 caracteres
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center space-x-2"
              disabled={loading}
            >
              {loading && <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Salvando..." : (transaction ? "Atualizar" : "Criar Transação")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionForm;
