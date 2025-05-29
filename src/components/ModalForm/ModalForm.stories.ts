import type { Meta, StoryObj } from '@storybook/nextjs';
import { ModalForm } from './index';
import React from 'react';

const meta: Meta<typeof ModalForm> = {
  title: 'Components/ModalForm',
  component: ModalForm,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof ModalForm>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
};
