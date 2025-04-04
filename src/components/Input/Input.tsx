import React from "react";
import { inputVariants } from "./inputVariants";
import { FieldError } from "@/components/FieldError";

type InputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  prefix?: string;
  variant?: keyof typeof inputVariants;
};

export const Input = ({
  id,
  label,
  type = "text",
  placeholder,
  value = "",
  onChange,
  onBlur,
  error,
  disabled = false,
  prefix,
  variant = "default",
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
    const num = parseInt(val.replace(/\D/g, "")) || 0;
    return `R$ ${(num / 100).toFixed(2).replace(".", ",")}`;
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").replace(/^0+/, "");
    const fakeEvent = {
      ...e,
      target: {
        ...e.target,
        value: raw,
      },
    };
    onChange?.(fakeEvent as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>

      {type === "currency" ? (
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={formatCurrency(String(value))}
          onChange={handleCurrencyChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={baseStyle}
        />
      ) : (
        <div className="relative w-full">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dark pointer-events-none text-sm">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type={type === "number" ? "text" : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`${baseStyle} ${prefix ? "pl-10" : ""}`}
          />
        </div>
      )}

      <FieldError message={error} />
    </div>
  );
};
