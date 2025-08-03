import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from './index';
import React, { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'currency'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    prefix: { control: 'text' },
    variant: { control: 'select', options: ['default', 'error', 'disabled', 'form'] },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

type InputProps = React.ComponentProps<typeof Input>;

function ControlledTemplate(args: InputProps) {
  const [value, setValue] = useState(args.value || '');
  return React.createElement(Input, {
    ...args,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
  });
}

export const Text: Story = {
  render: ControlledTemplate,
  args: {
    id: 'text-input',
    label: 'Nome',
    type: 'text',
    placeholder: 'Digite seu nome',
    value: '',
  },
};

export const Email: Story = {
  render: ControlledTemplate,
  args: {
    id: 'email-input',
    label: 'E-mail',
    type: 'email',
    placeholder: 'Digite seu e-mail',
    value: '',
  },
};

export const Currency: Story = {
  render: ControlledTemplate,
  args: {
    id: 'currency-input',
    label: 'Valor',
    type: 'currency',
    placeholder: 'R$ 0,00',
    value: '',
  },
};
