import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./index";
import type { ButtonsVariant } from "@/const";
import React from "react";

const variants: ButtonsVariant[] = [
  "primary",
  "secondary",
  "error",
  "blackGhost",
  "secondaryGhost",
  "greenGhost",
  "black",
  "red",
];

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    variant: {
      control: { type: "select" },
      options: variants,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const AllVariants: Story = {
  render: (args) => {
    return React.createElement(
      "div",
      { style: { display: "flex", gap: 12, flexWrap: "wrap" } },
      variants.map((variant) =>
        React.createElement(
          Button,
          { ...args, key: variant, variant },
          variant
        )
      )
    );
  },
  args: {
    children: "Button",
  },
};
