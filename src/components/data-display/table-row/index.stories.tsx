import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { TableRow } from './index';

const meta: Meta<typeof TableRow> = {
  title: 'Table Row',
  component: TableRow,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    ranking: {
      control: 'number',
      description: 'The ranking position of the country',
    },
    countryCode: {
      control: 'text',
      description: 'ISO 3166-1 alpha-3 country code',
    },
    gold: {
      control: 'text',
      description: 'Number of gold medals (can be number or string)',
    },
    silver: {
      control: 'text',
      description: 'Number of silver medals (can be number or string)',
    },
    bronze: {
      control: 'text',
      description: 'Number of bronze medals (can be number or string)',
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
    ranking: 1,
    countryCode: 'USA',
    gold: 39,
    silver: 41,
    bronze: 33,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that all data is displayed correctly using data-testid
    await expect(canvas.getByTestId('ranking')).toHaveTextContent('1');
    await expect(canvas.getByTestId('country-code')).toHaveTextContent('USA');
    await expect(canvas.getByTestId('gold-count')).toHaveTextContent('39');
    await expect(canvas.getByTestId('silver-count')).toHaveTextContent('41');
    await expect(canvas.getByTestId('bronze-count')).toHaveTextContent('33');
    await expect(canvas.getByTestId('total-count')).toHaveTextContent('113');
    
    // Check that flag is displayed
    const flag = canvas.getByRole('img');
    await expect(flag).toHaveAttribute('aria-label', 'United States of America flag');
  },
};

export const ValidNumbers: Story = {
  args: {
    ranking: 2,
    countryCode: 'CHN',
    gold: 38,
    silver: 32,
    bronze: 18,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    await expect(canvas.getByText('38')).toBeInTheDocument();
    await expect(canvas.getByText('32')).toBeInTheDocument();
    await expect(canvas.getByText('18')).toBeInTheDocument();
    await expect(canvas.getByText('88')).toBeInTheDocument(); // Total
  },
};

export const StringNumbers: Story = {
  args: {
    ranking: 3,
    countryCode: 'DEU',
    gold: '12',
    silver: '16',
    bronze: '8',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Strings should be parsed and displayed as numbers
    await expect(canvas.getByText('12')).toBeInTheDocument();
    await expect(canvas.getByText('16')).toBeInTheDocument();
    await expect(canvas.getByText('8')).toBeInTheDocument();
    await expect(canvas.getByText('36')).toBeInTheDocument(); // Total
  },
};

export const ZeroValues: Story = {
  args: {
    ranking: 4,
    countryCode: 'AUT',
    gold: 0,
    silver: 0,
    bronze: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Zero should be displayed as 0, not dash
    const cells = canvas.getAllByText('0');
    await expect(cells).toHaveLength(4); // 3 medal columns + total
  },
};

export const MixedValidAndInvalid: Story = {
  args: {
    ranking: 5,
    countryCode: 'FRA',
    gold: 10,
    silver: 'invalid',
    bronze: 8,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Valid numbers should display
    await expect(canvas.getByTestId('gold-count')).toHaveTextContent('10');
    await expect(canvas.getByTestId('bronze-count')).toHaveTextContent('8');
    
    // Invalid should show dash
    await expect(canvas.getByTestId('silver-count')).toHaveTextContent('—');
    
    // Total should only include valid values (10 + 8 = 18)
    await expect(canvas.getByTestId('total-count')).toHaveTextContent('18');
  },
};

export const AllInvalidMedals: Story = {
  args: {
    ranking: 6,
    countryCode: 'CAN',
    gold: 'invalid',
    silver: null,
    bronze: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // All medal counts should show dashes
    await expect(canvas.getByTestId('gold-count')).toHaveTextContent('—');
    await expect(canvas.getByTestId('silver-count')).toHaveTextContent('—');
    await expect(canvas.getByTestId('bronze-count')).toHaveTextContent('—');
    
    // Total should be 0 (no valid values)
    await expect(canvas.getByTestId('total-count')).toHaveTextContent('0');
  },
};

export const InvalidCountryCode: Story = {
  args: {
    ranking: 7,
    countryCode: 'INVALID',
    gold: 5,
    silver: 3,
    bronze: 2,
  },
  render: (args) => <TableRow {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Row should not be rendered at all for invalid country code
    await expect(canvas.queryByText('7')).not.toBeInTheDocument();
    await expect(canvas.queryByText('INVALID')).not.toBeInTheDocument();
  },
};

export const MissingCountryCode: Story = {
  args: {
    ranking: 8,
    countryCode: null,
    gold: 5,
    silver: 3,
    bronze: 2,
  },
  render: (args) => <TableRow {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Row should not be rendered for missing country code
    await expect(canvas.queryByText('8')).not.toBeInTheDocument();
  },
};

export const EdgeCaseStrings: Story = {
  args: {
    ranking: 9,
    countryCode: 'NOR',
    gold: '  5  ', // String with whitespace
    silver: '3.0', // Decimal that should be invalid
    bronze: '2abc', // String with non-numeric characters
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Whitespace-padded string should be valid as they are parsed as numbers
    await expect(canvas.getByTestId('gold-count')).toHaveTextContent('5');
    
    // Decimal should be invalid
    await expect(canvas.getByTestId('silver-count')).toHaveTextContent('—');
    
    // String with non-numeric characters should be invalid
    await expect(canvas.getByTestId('bronze-count')).toHaveTextContent('—');
  },
};

export const AllCountries: Story = {
  render: () => {
    const countries = [
      { code: 'USA', rank: 1, gold: 39, silver: 41, bronze: 33 },
      { code: 'CHN', rank: 2, gold: 38, silver: 32, bronze: 18 },
      { code: 'DEU', rank: 3, gold: 12, silver: 16, bronze: 8 },
      { code: 'FRA', rank: 4, gold: 10, silver: 11, bronze: 10 },
      { code: 'CAN', rank: 5, gold: 9, silver: 7, bronze: 11 },
    ];
    
    return (
      <>
        {countries.map(country => (
          <TableRow
            key={country.code}
            ranking={country.rank}
            countryCode={country.code}
            gold={country.gold}
            silver={country.silver}
            bronze={country.bronze}
          />
        ))}
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that all rows are rendered using data-testid
    await expect(canvas.getByTestId('table-row-USA')).toBeInTheDocument();
    await expect(canvas.getByTestId('table-row-CHN')).toBeInTheDocument();
    await expect(canvas.getByTestId('table-row-DEU')).toBeInTheDocument();
    await expect(canvas.getByTestId('table-row-FRA')).toBeInTheDocument();
    await expect(canvas.getByTestId('table-row-CAN')).toBeInTheDocument();
    
    // Check that flags are displayed
    const flags = canvas.getAllByRole('img');
    await expect(flags).toHaveLength(5);
  },
};

export const CaseInsensitiveCountryCode: Story = {
  args: {
    ranking: 10,
    countryCode: 'usa', // lowercase should work
    gold: 5,
    silver: 3,
    bronze: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Should render correctly with lowercase input
    await expect(canvas.getByTestId('ranking')).toHaveTextContent('10');
    await expect(canvas.getByTestId('country-code')).toHaveTextContent('USA'); // But display uppercase
    await expect(canvas.getByTestId('gold-count')).toHaveTextContent('5');
    
    // Check that flag is displayed correctly
    const flag = canvas.getByRole('img');
    await expect(flag).toHaveAttribute('aria-label', 'United States of America flag');
  },
};

export const MixedCaseCountryCode: Story = {
  args: {
    ranking: 11,
    countryCode: 'CaN', // mixed case should work
    gold: 3,
    silver: 1,
    bronze: 4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Should render correctly with mixed case input
    await expect(canvas.getByTestId('ranking')).toHaveTextContent('11');
    await expect(canvas.getByTestId('country-code')).toHaveTextContent('CAN'); // But display uppercase
    await expect(canvas.getByTestId('gold-count')).toHaveTextContent('3');
    
    // Check that flag is displayed correctly
    const flag = canvas.getByRole('img');
    await expect(flag).toHaveAttribute('aria-label', 'Canada flag');
  },
};

export const WithCustomClassName: Story = {
  args: {
    ranking: 1,
    countryCode: 'SWE',
    gold: 4,
    silver: 4,
    bronze: 3,
    className: 'bg-yellow-50 hover:bg-yellow-100',
  },
}; 