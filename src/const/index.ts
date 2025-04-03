export type ButtonsVariant =
  | "primary"
  | "secondary"
  | "error"
  | "blackGhost"
  | "greenGhost"
  | "black";

export const actions =
  [
    { label: "Abrir Minha Conta", href: "#", variant: "secondary" as ButtonsVariant},
    { label: "Já tenho Conta", href: "#", variant: "greenGhost" as ButtonsVariant},
  ]
  
export const actionsBlack =
  [
    { label: "Abrir Minha Conta", href: "#", variant: "black" as ButtonsVariant},
    { label: "Já tenho Conta", href: "#", variant: "blackGhost" as ButtonsVariant},
  ]
