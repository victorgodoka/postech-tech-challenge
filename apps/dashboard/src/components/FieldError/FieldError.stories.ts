import type { Meta, StoryObj } from '@storybook/nextjs';
import { FieldError } from './index';

const meta: Meta<typeof FieldError> = {
  title: 'Components/FieldError',
  component: FieldError,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof FieldError>;

export const Default: Story = {
  args: {
    message: 'Este campo é obrigatório.',
  },
};

export const NoMessage: Story = {
  args: {
    message: '',
  },
};
