import type { Meta, StoryObj } from '@storybook/nextjs';
import { Footer } from './index';
import React from 'react';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    columns: [
      {
        title: 'Institucional',
        links: [
          { label: 'Sobre', href: '#' },
          { label: 'Contato', href: '#' },
        ],
      },
      {
        title: 'Produtos',
        links: [
          { label: 'Cartão', href: '#' },
          { label: 'Empréstimo', href: '#' },
        ],
      },
      {
        title: 'Ajuda',
        links: [
          { label: 'FAQ', href: '#' },
          { label: 'Suporte', href: '#' },
        ],
      },
    ],
  },
};
