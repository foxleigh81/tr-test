import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { CountryFlag, type CountryCode } from './index';

const meta: Meta<typeof CountryFlag> = {
  title: 'CountryFlag',
  component: CountryFlag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    countryCode: {
      control: 'select',
      options: ['AUT', 'BLR', 'CAN', 'CHN', 'FRA', 'DEU', 'ITA', 'NLD', 'NOR', 'RUS', 'CHE', 'SWE', 'USA'],
      description: 'ISO 3166-1 alpha-3 country code',
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
    countryCode: 'USA',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const flag = canvas.getByRole('img');
    
    // Check that the flag has correct accessibility attributes
    await expect(flag).toHaveAttribute('aria-label', 'United States of America flag');
    await expect(flag).toHaveAttribute('title', 'United States of America');
    
    // Check that the flag has the correct dimensions
    await expect(flag).toHaveStyle('width: 28px; height: 17px');
  },
};

export const Austria: Story = {
  args: {
    countryCode: 'AUT',
  },
};

export const Canada: Story = {
  args: {
    countryCode: 'CAN',
  },
};

export const Germany: Story = {
  args: {
    countryCode: 'DEU',
  },
};

export const Norway: Story = {
  args: {
    countryCode: 'NOR',
  },
};

export const Switzerland: Story = {
  args: {
    countryCode: 'CHE',
  },
};

export const AllFlags: Story = {
  render: () => {
    const countryCodes: CountryCode[] = ['AUT', 'BLR', 'CAN', 'CHN', 'FRA', 'DEU', 'ITA', 'NLD', 'NOR', 'RUS', 'CHE', 'SWE', 'USA'];
    
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {countryCodes.map((code) => (
          <div key={code} className="flex flex-col items-center space-y-2">
            <CountryFlag countryCode={code} />
            <span className="text-sm font-medium">{code}</span>
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const flags = canvas.getAllByRole('img');
    
    // Check that all 13 flags are rendered
    await expect(flags).toHaveLength(13);
    
    // Check a few specific flags have correct attributes
    const austriaFlag = flags.find((flag: HTMLElement) => flag.getAttribute('aria-label') === 'Austria flag');
    const usaFlag = flags.find((flag: HTMLElement) => flag.getAttribute('aria-label') === 'United States of America flag');
    const germanyFlag = flags.find((flag: HTMLElement) => flag.getAttribute('aria-label') === 'Germany flag');
    
    await expect(austriaFlag).toBeTruthy();
    await expect(usaFlag).toBeTruthy();
    await expect(germanyFlag).toBeTruthy();
  },
};

export const WithCustomClassName: Story = {
  args: {
    countryCode: 'NOR',
    className: 'border-2 border-blue-500 rounded',
  },
}; 