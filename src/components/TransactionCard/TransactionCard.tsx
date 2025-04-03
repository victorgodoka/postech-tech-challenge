import clsx from "clsx";
import moment from "moment";
moment.locale("pt-BR");

type TransactionCardProps = {
  transaction: string;
  date: string | Date;
  value: number;
  type?: "entrada" | "saida";
};

export const TransactionCard = ({
  transaction,
  date,
  value,
  type,
}: TransactionCardProps) => {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);

  return (
    <div className="rounded p-4 bg-white w-full flex justify-between items-center">
      <div>
        <span className="text-sm text-primary font-semibold uppercase">
          {moment(date).format("MMMM")}
        </span>
        <div className="flex flex-col">
          <span className="text-base text-black">{transaction}</span>
          <span
            className={clsx(
              "text-base font-bold",
              type === "saida" ? "text-error" : "text-black"
            )}
          >
            {type === "saida" ? "-" : ""}
            {formattedValue}
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-500">{moment(date).format("L")}</span>
    </div>
  );
};
