"use client"
import { Button } from "@/components/Button";
import { FeatureCard } from "@/components/FeatureCard";
import { LoginForm } from "@/components/LoginForm";
import { ModalForm } from "@/components/ModalForm";
import { useState } from "react";
import Image from "next/image";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleFormModalOpen = () => {
    setIsFormModalOpen(true);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <TopBar
        variant="home"
        logo={
          <Image width={146} height={32} alt="Logo" src="/logo-green.png" />
        }
        links={[
          { label: "Home", href: "#" },
          { label: "Sobre", href: "/oijio" },
        ]}
        actions={
          <>
            <Button
              type="button"
              onClick={handleFormModalOpen}
              variant={"secondary"}
            >
              Abrir Minha Conta
            </Button>
            <Button
              type="button"
              onClick={handleLoginModalOpen}
              variant={"secondaryGhost"}
            >
              Já tenho Conta
            </Button>
          </>
        }
      />
      <div className="bg-gradient-to-b from-green-from to-green-to px-4 py-8">
        <ModalForm isOpen={isFormModalOpen} onClose={handleFormModalClose} />
        <LoginForm isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
        <div className="flex flex-col xl:flex-row items-center justify-center gap-8">
          <p className="text-center xl:text-left text-black text-2xl font-bold w-full max-w-[446px]">
            Experimente mais liberdade no controle da sua vida financeira.
            <br />
            Crie sua conta com a gente!
          </p>
          <Image
            src={"/home-graphs.png"}
            width={661}
            height={412}
            className="my-8 w-full max-w-78 md:max-w-[600px] xl:max-w-[661px]"
            alt="Pessoa segurando dinheiro ao lado de gráficos de barras em crescimento, simbolizando finanças ou controle de investimentos."
            sizes="(max-width: 767px) 312px, (max-width: 1279px) 600px, 661px"
          />
        </div>
        <div className="flex md:hidden gap-4 items-center justify-center py-4">
          <Button type="button" onClick={handleFormModalOpen} variant={"black"}>
            Abrir Minha Conta
          </Button>
          <Button
            type="button"
            onClick={handleLoginModalOpen}
            variant={"blackGhost"}
          >
            Já tenho Conta
          </Button>
        </div>
        <div className="flex flex-wrap max-w-3xl mx-auto text-center justify-center">
          <h2 className="w-full font-bold text-2xl">
            Vantagens do nosso banco:
          </h2>
          <FeatureCard
            icon={"mynaui:gift"}
            title={"Conta e cartão gratuitos"}
            description={
              "Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção."
            }
          />
          <FeatureCard
            icon={"majesticons:money-hand"}
            title={"Saques sem custo"}
            description={
              "Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h."
            }
          />
          <FeatureCard
            icon={"meteor-icons:star"}
            title={"Programa de pontos"}
            description={
              "Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!"
            }
          />
          <FeatureCard
            icon={"tdesign:device"}
            title={"Seguro Dispositivos"}
            description={
              "Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica."
            }
          />
        </div>
      </div>
      <Footer
        columns={[
          {
            title: "Serviços",
            links: [
              {
                label: "Conta Corrent",
                href: "#",
              },
              {
                label: "Conta PJ",
                href: "#",
              },
              {
                label: "Cartão de Crédito",
                href: "#",
              },
            ],
          },
          {
            title: "Contato",
            links: [
              {
                label: "0800 004 250 08",
                href: "tel:080000425",
              },
              {
                label: "meajuda@bytebank.com.br",
                href: "matilto:meajuda@bytebank.com.br",
              },
              {
                label: "ouvidoria@bytebank.com.br",
                href: "mailto:ouvidoria@bytebank.com.br",
              },
            ],
          },
        ]}
      />
    </>
  );
}
