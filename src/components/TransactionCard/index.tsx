import clsx from "clsx";
import moment from "moment";
moment.locale("pt-BR");

type TransactionCardProps = {
  type: string;
  date: string | Date;
  value: number;
};

export const TransactionCard = ({
  type,
  date,
  value,
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
      <span className="text-xs text-gray-500">{moment(date).format("L")}</span>
    </div>
  );
};
