import { Button } from "@/components/Button";
import { LoginForm } from "@/components/LoginForm";
import { ModalForm } from "@/components/ModalForm";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function NotFound() {
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
    <div className="flex flex-col min-h-screen">
      <TopBar
        variant="home"
        logo={
          <Image width={146} height={32} alt="Logo" src="/logo-green.png" />
        }
        links={[
          { label: "Home", href: "/" },
          { label: "Sobre", href: "#" },
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
      <div className="bg-gradient-to-b from-green-from to-green-to px-4 py-8 flex-1">
        <ModalForm isOpen={isFormModalOpen} onClose={handleFormModalClose} />
        <LoginForm isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
        <div className="mx-auto w-full px-8 py-8 max-w-2xl text-center">
          <p className="text-3xl font-bold">
            Ops! Não encontramos a página...{" "}
          </p>
          <p className="text-base">
            E olha que exploramos o universo procurando por ela!
            <br />
            Que tal voltar e tentar novamente?
          </p>
          <Image
            width={946}
            height={708}
            src="/not-found.png"
            alt="Pessoa com uma lupa em um cenário espacial, ao lado da mensagem 404 com um planeta e estrelas, representando página não encontrada."
            className="w-full my-8"
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
    </div>
  );
}
