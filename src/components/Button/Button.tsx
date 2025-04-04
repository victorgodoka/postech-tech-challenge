import React from "react";
import { buttonVariants } from "./buttonVariants";
import Link from "next/link";
import { ButtonsVariant } from "@/const";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "a" | "link" | "submit";
  disabled?: boolean;
  href?: string;
  variant: ButtonsVariant;
};

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  href = "#",
}: ButtonProps) => {
  const variantClass = disabled
    ? buttonVariants.disabled
    : buttonVariants[variant];

  if (type === "a")
    return (
      <a
        onClick={onClick}
        href={href}
        type={type}
        className={`${buttonVariants.base} ${variantClass}`}
      >
        {children}
      </a>
    );

  if (type === "link")
    return (
      <Link
        onClick={onClick}
        href={href}
        type={type}
        className={`${buttonVariants.base} ${variantClass}`}
      >
        {children}
      </Link>
    );

    return <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${buttonVariants.base} ${variantClass}`}
    >
      {children}
    </button>;
};
