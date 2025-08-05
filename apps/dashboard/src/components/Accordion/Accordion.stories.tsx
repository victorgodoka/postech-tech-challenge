import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './index';
import type { AccordionItem } from './types';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible accordion component that supports single or multiple item expansion with customizable content.',
      },
    },
  },
  argTypes: {
    items: {
      description: 'Array of accordion items to display',
      control: { type: 'object' },
    },
    allowMultiple: {
      description: 'Allow multiple items to be open at the same time',
      control: { type: 'boolean' },
    },
    defaultOpenItems: {
      description: 'Array of item IDs that should be open by default',
      control: { type: 'object' },
    },
    className: {
      description: 'Additional CSS classes to apply to the accordion',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// Sample data for stories
const basicItems: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'What is a Dashboard?',
    content: (
      <div>
        <p>A dashboard is a visual display of the most important information needed to achieve one or more objectives.</p>
        <ul className="mt-2 list-disc list-inside">
          <li>Consolidated on a single screen</li>
          <li>Real-time monitoring</li>
          <li>Interactive elements</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'item-2',
    title: 'Key Features',
    content: (
      <div>
        <p>Our dashboard includes these essential features:</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Analytics</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Reporting</span>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Alerts</span>
          <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-sm">Customization</span>
        </div>
      </div>
    ),
  },
  {
    id: 'item-3',
    title: 'Getting Started',
    content: (
      <div>
        <p>Follow these steps to get started:</p>
        <ol className="mt-2 list-decimal list-inside">
          <li>Set up your account</li>
          <li>Configure your preferences</li>
          <li>Add your data sources</li>
          <li>Create your first dashboard</li>
        </ol>
      </div>
    ),
  },
];

const itemsWithDisabled: AccordionItem[] = [
  ...basicItems,
  {
    id: 'item-4',
    title: 'Premium Feature (Disabled)',
    content: <p>This feature is only available in the premium version.</p>,
    disabled: true,
  },
];

const faqItems: AccordionItem[] = [
  {
    id: 'faq-1',
    title: 'How do I reset my password?',
    content: (
      <div>
        <p>To reset your password:</p>
        <ol className="mt-2 list-decimal list-inside">
          <li>Click on &quot;Forgot Password&quot; on the login page</li>
          <li>Enter your email address</li>
          <li>Check your email for reset instructions</li>
          <li>Follow the link and create a new password</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'faq-2',
    title: 'Can I export my data?',
    content: (
      <div>
        <p>Yes! You can export your data in multiple formats:</p>
        <ul className="mt-2 list-disc list-inside">
          <li>CSV files</li>
          <li>PDF reports</li>
          <li>JSON format</li>
          <li>Excel spreadsheets</li>
        </ul>
        <p className="mt-2 text-sm text-gray-600">
          Go to Settings → Data Export to access these options.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-3',
    title: 'Is my data secure?',
    content: (
      <div>
        <p>Absolutely! We take security seriously:</p>
        <ul className="mt-2 list-disc list-inside">
          <li>256-bit SSL encryption</li>
          <li>Regular security audits</li>
          <li>GDPR compliant</li>
          <li>SOC 2 Type II certified</li>
        </ul>
      </div>
    ),
  },
];

// Default story
export const Default: Story = {
  args: {
    items: basicItems,
  },
};

// Single item open by default
export const WithDefaultOpen: Story = {
  args: {
    items: basicItems,
    defaultOpenItems: ['item-1'],
  },
};

// Allow multiple items to be open
export const MultipleOpen: Story = {
  args: {
    items: basicItems,
    allowMultiple: true,
    defaultOpenItems: ['item-1', 'item-2'],
  },
};

// With disabled items
export const WithDisabledItems: Story = {
  args: {
    items: itemsWithDisabled,
    defaultOpenItems: ['item-1'],
  },
};

// FAQ style accordion
export const FAQStyle: Story = {
  args: {
    items: faqItems,
    allowMultiple: true,
    className: 'max-w-2xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'An accordion styled for FAQ sections with multiple items that can be open simultaneously.',
      },
    },
  },
};

// Compact version
export const Compact: Story = {
  args: {
    items: [
      {
        id: 'compact-1',
        title: 'Quick Info',
        content: <p>Brief information that doesn&apos;t take much space.</p>,
      },
      {
        id: 'compact-2',
        title: 'Another Item',
        content: <p>Another piece of concise information.</p>,
      },
    ],
    className: 'max-w-md',
  },
};

// All items disabled
export const AllDisabled: Story = {
  args: {
    items: basicItems.map(item => ({ ...item, disabled: true })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the accordion behaves when all items are disabled.',
      },
    },
  },
};

// Single item
export const SingleItem: Story = {
  args: {
    items: [basicItems[0]],
    defaultOpenItems: ['item-1'],
  },
};

// Long content
export const LongContent: Story = {
  args: {
    items: [
      {
        id: 'long-1',
        title: 'Long Content Example',
        content: (
          <div>
            <p>This is an example of an accordion item with longer content to test scrolling and height behavior.</p>
            <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p className="mt-2">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <ul className="mt-4 list-disc list-inside">
              <li>Point one with detailed explanation</li>
              <li>Point two with additional context</li>
              <li>Point three with more information</li>
              <li>Point four with extended details</li>
              <li>Point five with comprehensive coverage</li>
            </ul>
          </div>
        ),
      },
    ],
    defaultOpenItems: ['long-1'],
  },
};
