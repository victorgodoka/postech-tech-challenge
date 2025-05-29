import type { Meta, StoryObj } from '@storybook/nextjs';
import { TransactionCard } from './index';
import React from 'react';

const meta: Meta<typeof TransactionCard> = {
  title: 'Components/TransactionCard',
  component: TransactionCard,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    date: { control: 'date' },
    value: { control: 'number' },
    editable: { control: 'boolean' },
    deleteTransaction: { action: 'delete' },
    editTransaction: { action: 'edit' },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionCard>;

export const Deposit: Story = {
  args: {
    type: 'Depósito',
    date: new Date('2025-05-29'),
    value: 150000,
    editable: false,
  },
};

export const Withdrawal: Story = {
  args: {
    type: 'Saque',
    date: new Date('2025-05-28'),
    value: -5000,
    editable: false,
  },
};

export const Editable: Story = {
  args: {
    type: 'Depósito',
    date: new Date('2025-05-27'),
    value: 20000,
    editable: true,
  },
};
