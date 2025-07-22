import type { Meta, StoryObj } from '@storybook/nextjs';
import NewTransactionForm from './index';

const meta: Meta<typeof NewTransactionForm> = {
  title: 'Components/NewTransactionForm',
  component: NewTransactionForm,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
    accountId: { control: 'text' },
    transaction: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof NewTransactionForm>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    accountId: '1',
  },
};

export const EditTransaction: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    accountId: '1',
    transaction: {
      id: 'tx-123',
      value: 5000,
      type: 'Depósito',
      date: '2025-05-29',
    },
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    accountId: '1',
  },
};
