import { Button } from "@/components/Button";
import { FeatureCard } from "@/components/FeatureCard";
import { actionsBlack } from "@/const";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-green-from to-green-to px-4 py-8">
      <div className="flex flex-col xl:flex-row items-center justify-center gap-8">
        <p className="text-center xl:text-left text-black text-2xl font-bold w-full max-w-[446px]">
          Experimente mais liberdade no controle da sua vida financeira.<br />
          Crie sua conta com a gente!
        </p>
        <Image
          src={"/home-graphs.png"}
          width={661}
          height={412}
          className="my-8 w-full max-w-78 md:max-w-[600px] xl:max-w-[661px]"
          alt={"Gráfico na Home"}
          sizes="(max-width: 767px) 312px, (max-width: 1279px) 600px, 661px"
        />
      </div>
      <div className="flex md:hidden gap-4 items-center justify-center py-4">
        {actionsBlack.map((action, index) => (
          <Button type="a" href="#" variant={action.variant} key={index}>
            {action.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap max-w-3xl mx-auto text-center justify-center">
        <h2 className="w-full font-bold text-2xl">Vantagens do nosso banco:</h2>
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
  );
}
