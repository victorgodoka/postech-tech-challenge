import React from "react";
import { inputVariants } from "./inputVariants";
import { FieldError } from "@/components/FieldError";

// Props customizadas específicas do nosso componente
type CustomInputProps = {
  label: string;
  error?: string;
  prefix?: string;
  variant?: keyof typeof inputVariants;
  ref?: React.RefObject<HTMLInputElement | null>;
};  

// Combinar props nativas do input com nossas props customizadas
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & CustomInputProps;

export const Input = ({
  label,
  error,
  prefix,
  variant = "default",
  type = "text",
  value = "",
  disabled = false,
  ref,
  ...inputProps
}: InputProps) => {
  const baseStyle = [
    inputVariants.base,
    inputVariants[variant] ?? inputVariants.default,
    error && inputVariants.error,
    disabled && inputVariants.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  const formatCurrency = (val: string) => {
    if (!val) return "";
    // Garantir que sempre temos pelo menos 2 dígitos para centavos
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal) return "";
    const num = parseInt(cleanVal) || 0;
    return `R$ ${(num / 100).toFixed(2).replace(".", ",")}`;
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover tudo que não é dígito
    const raw = e.target.value.replace(/\D/g, "");
    
    // Não remover zeros à esquerda se o valor for muito pequeno
    // Manter pelo menos 1 dígito
    const cleanValue = raw || "0";
    
    const fakeEvent = {
      ...e,
      target: {
        ...e.target,
        value: cleanValue,
      },
    };
    inputProps.onChange?.(fakeEvent as React.ChangeEvent<HTMLInputElement>);
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={inputProps.id} className="text-sm font-semibold text-primary">
        {label}
      </label>

      {type === "currency" ? (
        <input
          {...inputProps}
          type="tel"
          inputMode="numeric"
          value={formatCurrency(String(value))}
          onChange={handleCurrencyChange}
          disabled={disabled}
          className={baseStyle}
          ref={ref}
        />
      ) : (
        <div className="relative w-full">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dark pointer-events-none text-sm">
              {prefix}
            </span>
          )}
          <input
            {...inputProps}
            type={type === "number" ? "text" : type}
            value={value}
            disabled={disabled}
            className={`${baseStyle} ${prefix ? "pl-10" : ""}`}
            ref={ref}
          />
        </div>
      )}

      <FieldError message={error} />
    </div>
  );
};
