import React from "react";
import { buttonVariants } from "./buttonVariants";
import Link from "next/link";
import { ButtonsVariant } from "@/const";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  buttonType?: "button" | "a" | "link" | "submit";
  disabled?: boolean;
  href?: string;
  variant: ButtonsVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  onClick,
  buttonType = "button",
  variant = "primary",
  disabled = false,
  href = "#",
}: ButtonProps) => {
  const variantClass = disabled
    ? buttonVariants.disabled
    : buttonVariants[variant];

  if (buttonType === "a")
    return (
      <a
        onClick={onClick}
        href={href}
        type={buttonType}
        className={`${buttonVariants.base} ${variantClass}`}
      >
        {children}
      </a>
    );

  if (buttonType === "link")
    return (
      <Link
        onClick={onClick}
        href={href}
        type={buttonType}
        className={`${buttonVariants.base} ${variantClass}`}
      >
        {children}
      </Link>
    );

    return <button
      onClick={onClick}
      type={buttonType}
      disabled={disabled}
      className={`${buttonVariants.base} ${variantClass}`}
    >
      {children}
    </button>;
};
