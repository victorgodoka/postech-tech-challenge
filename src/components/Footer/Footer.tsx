"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";

type LinkColumn = {
  title: string;
  links: { label: string; href: string }[];
};

type FooterProps = {
  columns: LinkColumn[];
};

export const Footer = ({ columns }: FooterProps) => {
  return (
    <footer className="bg-black px-8 py-12 text-base text-white">
      <div className="flex flex-wrap flex-col md:flex-row gap-8 mx-auto max-w-1/2 md:max-w-2/3 xl:max-w-7xl xl:justify-between">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-bold mb-2">{col.title}</h4>
            <ul className="space-y-1">
              {col.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-bold mb-2">Desenvolvido por Alura</h4>
          <div className="flex flex-col gap-4">
            <Image width={146} height={32} alt="Logo" src="/logo.png" />
            <div className="grid grid-cols-3">
              <a href="#" aria-label="Instagram">
                <Icon icon="mdi:instagram" className="text-4xl" />
              </a>
              <a href="#" aria-label="WhatsApp">
                <Icon icon="mdi:whatsapp" className="text-4xl" />
              </a>
              <a href="#" aria-label="YouTube">
                <Icon icon="mdi:youtube" className="text-4xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
