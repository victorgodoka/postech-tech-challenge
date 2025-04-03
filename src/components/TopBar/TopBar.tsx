"use client";

import { ButtonsVariant } from "@/const";
import { Button } from "../Button";
import { topbarVariants } from "./topbarVariants";
import { Icon } from "@iconify/react";

type TopBarProps = {
  title?: string;
  variant?: "home" | "app";
  logo?: React.ReactNode;
  links?: { label: string; href: string }[];
  actions?: {
    label: string;
    href: string;
    variant: ButtonsVariant;
  }[];
};

export const TopBar = ({
  title = "",
  variant = "home",
  logo,
  links = [],
  actions = [],
}: TopBarProps) => {
  return (
    <header className={`w-full px-6 py-4 ${topbarVariants[variant]}`}>
      <div className="hidden max-w-7xl mx-auto md:flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {logo && <div className="">{logo}</div>}
          <span className="text-lg font-bold">{title}</span>
          {links.length > 0 && (
            <nav className="flex gap-4 ml-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg hover:underline font-semibold"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button type="a" href="#" variant={action.variant} key={index}>
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="items-center justify-between w-full flex md:hidden">
        <Icon icon={"material-symbols:menu"} className="text-2xl" />
        <div className="">{logo}</div>
      </div>
    </header>
  );
};
