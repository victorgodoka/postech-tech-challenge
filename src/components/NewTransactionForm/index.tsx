import React, { useState } from "react";
import { addTransaction, updateTransactionValueById, updateTransactionById } from "@/lib/api";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import moment from "moment";

const today = moment().format("YYYY-MM-DD");

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
  transaction?: {
    id: string;
    value: number;
    type: string;
    date: string;
  };
  onSubmit?: (data: { accountId: string; type: string; value: number; date: string }) => Promise<void>;
}) => {
  const [value, setValue] = useState(transaction ? transaction.value : "");
  const [type, setType] = useState(transaction ? transaction.type : "Depósito");
  const [date, setDate] = useState(transaction ? transaction.date : today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log(transaction)
  console.log(value)
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    let floatValue = Number(`${value}`.replace(",", "."));
    if (isNaN(floatValue) || floatValue <= 0) {
      setError("Digite um valor válido.");
      setLoading(false);
      return;
    }
    if (moment(date).isAfter(today)) {
      setError("A data não pode ser no futuro.");
      setLoading(false);
      return;
    }
    if (type === "Saque") floatValue = -floatValue;
    const valueInCents = Math.round(floatValue * 100);
    try {
      if (transaction) {
        // Editing existing transaction: update all fields
        await updateTransactionById(transaction.id, {
          accountId,
          type,
          value: valueInCents,
          date,
        });
      } else {
        // Creating new transaction
        await addTransaction({
          accountId,
          type,
          value: valueInCents,
          date,
        });
      }
      setValue("");
      setType("Depósito");
      setDate(today);
      onClose();
      if (onSubmit) await onSubmit({ accountId, type, value: valueInCents, date });
      window.location.reload();
    } catch (err) {
      setError("Erro ao registrar transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/55 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Nova Transação</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="valor"
            label="Valor"
            placeholder="Ex: 100,00"
            type="currency"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Select
            label="Tipo"
            options={[
              { label: "Depósito", value: "Depósito" },
              { label: "Saque", value: "Saque" },
            ]}
            value={type}
            onChange={setType}
          />
          <Input
            id="data"
            label="Data"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionForm;
