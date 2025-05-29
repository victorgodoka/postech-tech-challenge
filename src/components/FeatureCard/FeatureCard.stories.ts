import type { Meta, StoryObj } from '@storybook/nextjs';
import { FeatureCard } from './index';
import React from 'react';

const meta: Meta<typeof FeatureCard> = {
  title: 'Components/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = {
  args: {
    icon: 'mdi:star',
    title: 'Destaque',
    description: 'Este é um cartão de destaque para mostrar uma funcionalidade importante.',
  },
};
