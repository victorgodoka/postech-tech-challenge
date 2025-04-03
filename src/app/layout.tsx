"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

const geistSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <TopBar
          variant="home"
          logo={
            <Image width={146} height={32} alt="Logo" src="/logo-green.png" />
          }
          links={[
            { label: "Home", href: "#" },
            { label: "Sobre", href: "#" },
          ]}
          actions={[
            { label: "Abrir Minha Conta", href: "#", variant: "secondary" },
            { label: "Já tenho Conta", href: "#", variant: "greenGhost" },
          ]}
        />
        {children}
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
      </body>
    </html>
  );
}
