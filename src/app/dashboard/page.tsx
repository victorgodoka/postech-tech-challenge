"use client";
import { TopBar } from "@/components/TopBar";
import { useState } from "react";
import { Tabs, Tab } from "@/components/Tabs";
import Image from "next/image";
import Home from "./Home";

import { useAuth } from "@/hooks/useSession";
import { Account, useAccount } from "@/hooks/useAccount";
import { Transaction, useTransactions } from "@/hooks/useTransaction";
import { Services, useServices } from "@/hooks/useService";
import moment from "moment";
import "moment/locale/pt-br";
import Transactions from "./Transactions";
moment.locale("pt-br");

function Dashboard() {
  const { session } = useAuth();
  const account: Account | null = useAccount(session?.id || "");
  const transactions: Transaction[] = useTransactions(session?.id || "");
  const services: Services[] = useServices();
  const [active, setActive] = useState(0);

  return (
    <>
      <TopBar
        variant="app"
        logo={
          <Image width={146} height={32} alt="Logo" src="/logo-green.png" />
        }
      />
      <div className="p-4 w-full bg-light-green flex-1">
        <Tabs activeIndex={active} onTabChange={setActive}>
          <Tab>
            <Tab.Title>Início</Tab.Title>
            <Tab.Container>
              <Home account={account} transactions={transactions} services={services} />
            </Tab.Container>
          </Tab>
          <Tab>
            <Tab.Title>Transferências</Tab.Title>
            <Tab.Container>
              <Transactions transactions={transactions} />
            </Tab.Container>
          </Tab>
          <Tab>
            <Tab.Title>Investimentos</Tab.Title>
            <Tab.Container>Resumo geral</Tab.Container>
          </Tab>
          <Tab>
            <Tab.Title>Outros serviços</Tab.Title>
            <Tab.Container>Resumo geral</Tab.Container>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default Dashboard;
