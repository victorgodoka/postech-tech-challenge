import React, { useState, useEffect } from "react";
import moment from "moment";
import clsx from "clsx";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { TransactionCard } from "@/components/TransactionCard";
import { Account } from "@/hooks/useAccount";
import { Services } from "@/hooks/useService";
import { Transaction } from "@/hooks/useTransaction";

interface AccountProps {
  account: Account | null
  services: Services[]
  transactions: Transaction[]
}

const Home: React.FC<AccountProps> = ({ account, services, transactions }) => {
  const [toggleData, setToggleData] = useState(account?.balanceVisible);

  return (
    account && (
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex flex-col md:flex-row xl:flex-col gap-4 flex-1">
          <div className="rounded-md bg-navy p-8 w-full min-h-[620px] xl:min-h-[620px] md:min-h-auto text-white bg-[url('/home-mobile-bg.png')] bg-no-repeat bg-bottom">
            <h1 className="text-2xl font-semibold">Olá, {account?.name}</h1>
            <p className="capitalize text-sm my-4">
              {moment().format("dddd, L")}
            </p>
            <div className="">
              <div
                className="flex justify-between border-b-2 py-4 px-2 cursor-pointer border-white"
                onClick={() => setToggleData(!toggleData)}
              >
                <p className="text-xl font-bold">Saldo</p>
                {toggleData ? (
                  <Icon icon="mdi:eye" />
                ) : (
                  <Icon icon="mdi:eye-closed" />
                )}
              </div>
              <div className="py-4 px-2">
                <p className="text-sm font-light">Conta corrente</p>
                <p
                  className={clsx(
                    "text-4xl my-3 transition-all",
                    !toggleData && "blur-sm select-none"
                  )}
                >
                  R${" "}
                  {toggleData
                    ? (account.balance / 100).toFixed(2).replace(".", ",")
                    : "******,**"}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-gray p-4 text-white w-full ">
            <p className="font-bold text-black text-xl mb-4">
              Confira os serviços disponíveis
            </p>
            {services && (
              <div className="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center md:flex-col gap-2 p-2 xl:py-8 rounded-md bg-white text-black border border-white hover:border-green cursor-pointer transition-all"
                  >
                    <Image
                      src={`/${service.icon}.png`}
                      width={24}
                      height={24}
                      alt={service.label}
                      className="md:hidden"
                    />
                    <Image
                      src={`/${service.icon}.png`}
                      width={56}
                      height={56}
                      alt={service.label}
                      className="md:block hidden"
                    />
                    <p className="text-sm">{service.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-md bg-white p-4 text-black">
            <p className="font-bold text-black text-xl mb-4">Extrato</p>
            {transactions &&
              transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((transaction) => (
                  <TransactionCard key={transaction.id} {...transaction} />
                ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Home;
