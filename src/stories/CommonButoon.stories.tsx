// src/stories/CommonButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CommonButton } from '../components/atoms/CommonButton';

const meta: Meta<typeof CommonButton> = {
  title: 'Atoms/CommonButton',
  component: CommonButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary Button',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Submit: Story = {
  args: {
    children: 'Submit',
    type: 'submit',
  },
};