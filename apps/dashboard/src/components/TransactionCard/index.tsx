import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import moment from "moment";
moment.locale("pt-BR");

type TransactionCardProps = {
  type: string;
  date: string | Date;
  value: number;
  editable?: boolean;
  deleteTransaction?: () => Promise<void>;
  editTransaction?: () => void;
};

export const TransactionCard = ({
  type,
  date,
  value,
  editable = false,
  deleteTransaction,
  editTransaction,
}: TransactionCardProps) => {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);

  return (
    <div className="rounded p-4 bg-white w-full flex justify-between items-center border-b border-green">
      <div>
        <span className="text-sm text-primary font-semibold uppercase">
          {moment(date).format("MMMM")}
        </span>
        <div className="flex flex-col">
          <span className="text-base text-black">{type}</span>
          <span
            className={clsx(
              "text-base font-bold",
              value < 0 ? "text-error" : "text-black"
            )}
          >
            {formattedValue}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500">{moment(date).format("L")}</span>
        {editable && (
          <div className="flex flex-col items-center gap-2">
            <button className="cursor-pointer hover:text-blue-600" onClick={editTransaction}><Icon icon="ic:outline-mode-edit" width="24" height="24" /></button>
            <button className="cursor-pointer hover:text-red-500" onClick={deleteTransaction}><Icon icon="mdi:trash-can-empty" width="24" height="24" /></button>
          </div>
        )}
      </div>
    </div>
  );
};
