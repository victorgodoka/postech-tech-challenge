import type { Meta, StoryObj } from '@storybook/nextjs';
import { TopBar } from './index';
import Image from 'next/image';
import React from 'react';

const meta = {
  title: 'Components/TopBar',
  component: TopBar,
  tags: ['autodocs'],
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: {
    variant: 'home',
    logo: <Image width={146} height={32} alt="Logo" src="/logo-green.png" />,
    links: [
      { label: 'Home', href: '#' },
      { label: 'Sobre', href: '#' },
    ],
  },
};

export const App: Story = {
  args: {
    variant: 'app',
    logo: <Image width={146} height={32} alt="Logo" src="/logo-green.png" />,
  },
};
