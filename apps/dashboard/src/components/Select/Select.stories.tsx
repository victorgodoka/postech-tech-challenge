import type { Meta, StoryObj } from '@storybook/nextjs';
import { Select } from './index';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Selecione uma opção',
    options: [
      { value: '1', label: 'Opção 1' },
      { value: '2', label: 'Opção 2' },
    ],
    value: '',
    onChange: () => {},
  },
};
