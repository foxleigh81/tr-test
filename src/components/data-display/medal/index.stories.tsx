import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Medal, type MedalRank } from './index';

const meta: Meta<typeof Medal> = {
  title: 'Medal',
  component: Medal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rank: {
      control: 'select',
      options: ['gold', 'silver', 'bronze'],
      description: 'The type of medal to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rank: 'gold',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const medal = canvas.getByRole('img');
    
    // Check that the medal has correct accessibility attributes
    await expect(medal).toHaveAttribute('aria-label', 'Gold medal');
    
    // Check that the medal has the correct dimensions
    await expect(medal).toHaveAttribute('width', '20');
    await expect(medal).toHaveAttribute('height', '20');
  },
};

export const Gold: Story = {
  args: {
    rank: 'gold',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const medal = canvas.getByRole('img');
    
    await expect(medal).toHaveAttribute('aria-label', 'Gold medal');
  },
};

export const Silver: Story = {
  args: {
    rank: 'silver',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const medal = canvas.getByRole('img');
    
    await expect(medal).toHaveAttribute('aria-label', 'Silver medal');
  },
};

export const Bronze: Story = {
  args: {
    rank: 'bronze',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const medal = canvas.getByRole('img');
    
    await expect(medal).toHaveAttribute('aria-label', 'Bronze medal');
  },
};

export const AllMedals: Story = {
  render: () => {
    const medalRanks: MedalRank[] = ['gold', 'silver', 'bronze'];
    
    return (
      <div className="flex gap-6 items-center">
        {medalRanks.map((rank) => (
          <div key={rank} className="flex flex-col items-center space-y-2 w-16">
            <Medal rank={rank} />
            <span className="text-sm font-medium text-gray-500 capitalize">{rank}</span>
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const medals = canvas.getAllByRole('img');
    
    // Check that all 3 medals are rendered
    await expect(medals).toHaveLength(3);
    
    // Check each medal has correct accessibility attributes
    const goldMedal = medals.find((medal: HTMLElement) => medal.getAttribute('aria-label') === 'Gold medal');
    const silverMedal = medals.find((medal: HTMLElement) => medal.getAttribute('aria-label') === 'Silver medal');
    const bronzeMedal = medals.find((medal: HTMLElement) => medal.getAttribute('aria-label') === 'Bronze medal');
    
    await expect(goldMedal).toBeTruthy();
    await expect(silverMedal).toBeTruthy();
    await expect(bronzeMedal).toBeTruthy();
  },
};

export const WithCustomClassName: Story = {
  args: {
    rank: 'gold',
    className: 'border-2 border-yellow-400 rounded-full p-1',
  },
}; 