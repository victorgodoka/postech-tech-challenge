import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tabs, Tab } from './index';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultIndex: 0,
    children: (
      <>
        <Tab>
          <Tab.Title>Tab 1</Tab.Title>
          <Tab.Container>Conteúdo da Aba 1</Tab.Container>
        </Tab>
        <Tab>
          <Tab.Title>Tab 2</Tab.Title>
          <Tab.Container>Conteúdo da Aba 2</Tab.Container>
        </Tab>
      </>
    ),
  },
  render: (args) => (
    <Tabs {...args} />
  ),
};
