"use client";

import { useState } from "react";
import { FieldError } from "@/components/FieldError";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
};


export const Select = ({
  label,
  placeholder = "Selecione...",
  options,
  value,
  error,
  onChange,
}: SelectProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-1 relative w-full max-w-sm">
      <label className="text-sm font-semibold text-primary">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex justify-between items-center px-4 py-2 rounded border text-left text-sm text-primary bg-white ${
          error ? "border-error" : "border-primary"
        }`}
      >
        <span>
          {selectedOption?.label || (
            <span className="text-gray-dark">{placeholder}</span>
          )}
        </span>
        <span className="text-sm">{open ? "⮟" : "⮝"}</span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-primary rounded shadow text-sm font-sans top-18">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                  }}
                  className={`px-4 py-2 text-center text-primary cursor-pointer hover:bg-offwhite hover:font-bold ${
                  isSelected ? "bg-offwhite font-bold" : ""
                }`}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}

      <FieldError message={error} />
    </div>
  );
};
