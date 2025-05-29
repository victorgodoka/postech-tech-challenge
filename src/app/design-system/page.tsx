"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { TransactionCard } from "@/components/TransactionCard";

export default function DesignSystemPage() {
  const [nome, setNome] = useState("");
  const [valorCentavos, setValorCentavos] = useState("");
  const [valorSimples, setValorSimples] = useState("");
  const [customTipo, setCustomTipo] = useState("");
  const [customTipoErro, setCustomTipoErro] = useState("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValorCentavos(e.target.value);
  };

  const handleSimpleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValorSimples(e.target.value);
  };

  return (
    <main className="min-h-screen p-8 space-y-12 bg-gray-light text-primary font-sans">
      {/* Botões */}
      <section>
        <h2 className="text-lg font-bold">Botões</h2>
        <div className="flex gap-4 flex-wrap mt-4">
          <Button variant="primary">Primário</Button>
          <Button variant="primary" disabled>
            Primário Desabilitado
          </Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="secondary" disabled>
            Secundário Desabilitado
          </Button>
          <Button variant="blackGhost">Ghost</Button>
          <Button variant="blackGhost" disabled>
            Ghost Desabilitado
          </Button>
          <Button variant="greenGhost">Ghost</Button>
          <Button variant="greenGhost" disabled>
            Ghost Desabilitado
          </Button>
          <Button variant="error">Error</Button>
          <Button variant="error" disabled>
            Error Desabilitado
          </Button>
          <Button variant="black">Error</Button>
          <Button variant="black" disabled>
            Error Desabilitado
          </Button>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-lg font-bold">Inputs</h2>
        <div className="grid gap-6 max-w-md mt-4">
          <Input
            id="nome"
            label="Nome"
            placeholder="Digite seu nome"
            value={nome}
            onChange={handleNameChange}
          />

          <Input
            id="valorSimples"
            label="Valor simples com prefixo"
            type="text"
            placeholder="0,00"
            prefix="R$"
            value={valorSimples}
            onChange={handleSimpleChange}
          />

          <Input
            id="valorFormatado"
            label="Valor com máscara"
            type="currency"
            placeholder="0,00"
            value={valorCentavos}
            onChange={handleCurrencyChange}
          />
          <span className="text-sm text-gray-dark">
            Valor atual em centavos: <strong>{valorCentavos || "vazio"}</strong>
          </span>

          <Input id="data" label="Data" type="date" />
          <Input id="erro" label="Com erro" error="Campo obrigatório" />
          <Input id="desabilitado" label="Desabilitado" disabled />
        </div>
      </section>

      {/* Selects */}
      <section>
        <h2 className="text-lg font-bold">Selects</h2>
        <Select
          label="Tipo de transação (custom)"
          value={customTipo}
          onChange={setCustomTipo}
          options={[
            { value: "cambio", label: "Câmbio de Moeda" },
            { value: "doc", label: "DOC/TED" },
            { value: "emprestimo", label: "Empréstimo e Financiamento" },
          ]}
        />

        <Select
          label="Tipo custom com erro"
          value={customTipoErro}
          onChange={setCustomTipoErro}
          error="Campo obrigatório"
          options={[
            { value: "cambio", label: "Câmbio de Moeda" },
            { value: "doc", label: "DOC/TED" },
            { value: "emprestimo", label: "Empréstimo e Financiamento" },
          ]}
        />
      </section>

      {/* Transaction Cards */}
      <section>
        <h2 className="text-lg font-bold">Transaction Cards</h2>
        <div className="grid gap-4 max-w-md mt-4">
          <div className="grid gap-4 max-w-md">
            <TransactionCard
              date="2022-11-18"
              value={15000}
              type="entrada"
            />
            <TransactionCard
              date="2023-01-10"
              value={30000}
              type="saida"
            />
            <TransactionCard
              date="2023-02-05"
              value={40000}
              type="entrada"
            />
            <TransactionCard
              date="2023-03-01"
              value={100000}
              type="saida"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
