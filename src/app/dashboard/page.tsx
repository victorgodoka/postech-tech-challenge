"use client";
import { TopBar } from "@/components/TopBar";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "@/components/Tabs";
import Image from "next/image";
import Home from "./Home";
import { populateDB } from "@/lib/populate";

function Dashboard() {
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
              <Home />
            </Tab.Container>
          </Tab>
          <Tab>
            <Tab.Title>Transferências</Tab.Title>
            <Tab.Container>Resumo geral</Tab.Container>
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
