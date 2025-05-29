import type { Meta, StoryObj } from '@storybook/nextjs';
import { ConsentCheckbox } from './index';

const meta = {
  title: 'Components/ConsentCheckbox',
  component: ConsentCheckbox,
  tags: ['autodocs'],
} satisfies Meta<typeof ConsentCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
};
