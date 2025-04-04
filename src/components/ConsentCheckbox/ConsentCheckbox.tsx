import clsx from "clsx";
import React from "react";
import { Icon } from "@iconify/react";

type ConsentCheckboxProps = {
  checked: boolean;
  id?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ConsentCheckbox = ({
  checked,
  id = "consent-checkbox",
  onChange,
}: ConsentCheckboxProps) => {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />

      <div
        className={clsx(
          "w-5 h-5 transition-all cursor-pointer border-2 border-green rounded-md flex items-center justify-center",
          checked ? "bg-green" : "bg-white"
        )}
      >
        {checked && <Icon icon="material-symbols:close" className="text-white" />}
      </div>
      <p className="flex-1 text-sm text-black">
        Li e estou ciente quanto às condições de tratamento dos meus dados
        conforme descrito na{" "}
        <span className="underline">Política de Privacidade do banco</span>.
      </p>
    </label>
  );
};
