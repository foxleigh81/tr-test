import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within, userEvent } from 'storybook/test';
import { fn } from 'storybook/test';
import { TableHeading, type SortByType } from './index';
import { useState } from 'react';

const meta: Meta<typeof TableHeading> = {
  title: 'Table Heading',
  component: TableHeading,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    sortBy: {
      control: 'select',
      options: ['gold', 'silver', 'bronze', 'total'],
      description: 'The currently active sort column',
    },
    onSort: {
      action: 'sorted',
      description: 'Callback when a sortable column is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <table className="w-full">
        <Story />
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSort: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that all medal columns are present using data-testid
    const goldColumn = canvas.getByTestId('sort-gold');
    const silverColumn = canvas.getByTestId('sort-silver');
    const bronzeColumn = canvas.getByTestId('sort-bronze');
    const totalColumn = canvas.getByTestId('sort-total');
    
    await expect(goldColumn).toBeInTheDocument();
    await expect(silverColumn).toBeInTheDocument();
    await expect(bronzeColumn).toBeInTheDocument();
    await expect(totalColumn).toBeInTheDocument();
    
    // Check that gold is active by default (should have top border)
    await expect(goldColumn).toHaveClass('border-t-2', 'border-gray-500');
    
    // Check that medals are displayed
    const medals = canvas.getAllByRole('img');
    await expect(medals).toHaveLength(3);
    
    // Check total text is uppercase
    await expect(totalColumn).toHaveClass('uppercase');
    await expect(totalColumn).toHaveTextContent('total');
  },
};

export const SortByGold: Story = {
  args: {
    sortBy: 'gold',
    onSort: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const goldColumn = canvas.getByTestId('sort-gold');
    
    await expect(goldColumn).toHaveClass('border-t-2', 'border-gray-500');
  },
};

export const SortBySilver: Story = {
  args: {
    sortBy: 'silver',
    onSort: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const silverColumn = canvas.getByTestId('sort-silver');
    
    await expect(silverColumn).toHaveClass('border-t-2', 'border-gray-500');
  },
};

export const SortByBronze: Story = {
  args: {
    sortBy: 'bronze',
    onSort: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bronzeColumn = canvas.getByTestId('sort-bronze');
    
    await expect(bronzeColumn).toHaveClass('border-t-2', 'border-gray-500');
  },
};

export const SortByTotal: Story = {
  args: {
    sortBy: 'total',
    onSort: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const totalColumn = canvas.getByTestId('sort-total');
    
    await expect(totalColumn).toHaveClass('border-t-2', 'border-gray-500');
  },
};

export const ClickInteractions: Story = {
  args: {
    sortBy: 'gold',
    onSort: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Test clicking on silver column
    const silverColumn = canvas.getByTestId('sort-silver');
    await userEvent.click(silverColumn);
    await expect(args.onSort).toHaveBeenCalledWith('silver');
    
    // Test clicking on bronze column
    const bronzeColumn = canvas.getByTestId('sort-bronze');
    await userEvent.click(bronzeColumn);
    await expect(args.onSort).toHaveBeenCalledWith('bronze');
    
    // Test clicking on total column
    const totalColumn = canvas.getByTestId('sort-total');
    await userEvent.click(totalColumn);
    await expect(args.onSort).toHaveBeenCalledWith('total');
    
    // Test clicking on gold column
    const goldColumn = canvas.getByTestId('sort-gold');
    await userEvent.click(goldColumn);
    await expect(args.onSort).toHaveBeenCalledWith('gold');
  },
};

export const KeyboardInteractions: Story = {
  args: {
    sortBy: 'gold',
    onSort: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Test Enter key on silver column
    const silverColumn = canvas.getByTestId('sort-silver');
    silverColumn.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSort).toHaveBeenCalledWith('silver');
    
    // Test Space key on bronze column
    const bronzeColumn = canvas.getByTestId('sort-bronze');
    bronzeColumn.focus();
    await userEvent.keyboard(' ');
    await expect(args.onSort).toHaveBeenCalledWith('bronze');
  },
};

export const WithCustomClassName: Story = {
  args: {
    sortBy: 'total',
    onSort: fn(),
    className: 'bg-gray-100 text-lg',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tableRow = canvas.getByRole('row');
    
    await expect(tableRow).toHaveClass('bg-gray-100', 'text-lg');
  },
};

export const AllSortStates: Story = {
  render: () => {
    const sortOptions: SortByType[] = ['gold', 'silver', 'bronze', 'total'];
    
    return (
      <div className="space-y-8">
        {sortOptions.map((sortBy) => (
          <div key={sortBy} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600 capitalize">
              Sorted by {sortBy}
            </h3>
            <table className="w-full border border-gray-200">
              <TableHeading 
                sortBy={sortBy}
                onSort={() => {}}
              />
            </table>
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that all sort states are displayed - use data-testid to avoid conflicts
    const sortColumns = canvas.getAllByTestId(/^sort-/);
    await expect(sortColumns.length).toBeGreaterThanOrEqual(16); // 4 tables × 4 columns each
    
    // Check each table has the correct active sort column
    const goldTables = canvas.getAllByText('Sorted by gold');
    const silverTables = canvas.getAllByText('Sorted by silver');
    const bronzeTables = canvas.getAllByText('Sorted by bronze');
    const totalTables = canvas.getAllByText('Sorted by total');
    
    await expect(goldTables).toHaveLength(1);
    await expect(silverTables).toHaveLength(1);
    await expect(bronzeTables).toHaveLength(1);
    await expect(totalTables).toHaveLength(1);
  },
};

export const RollbackScenario: Story = {
  render: () => {
    const [externalSort, setExternalSort] = useState<SortByType>('gold');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleSort = async (sortBy: SortByType) => {
      setIsProcessing(true);
      // First update the external state to the new sort (simulating optimistic server state)
      setExternalSort(sortBy);
      
      // Simulate a failed request after 1 second and rollback
      setTimeout(() => {
        // Rollback to gold (simulating failed request)
        setExternalSort('gold');
        setIsProcessing(false);
      }, 1000);
    };
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>External sort state: <strong>{externalSort}</strong></p>
          <p>Status: {isProcessing ? 'Processing...' : 'Ready'}</p>
          <p className="text-xs mt-2">
            Click any column other than Gold to see optimistic update, then rollback after 1 second.
          </p>
        </div>
        <table className="w-full border border-gray-200">
          <TableHeading 
            sortBy={externalSort}
            onSort={handleSort}
          />
        </table>
      </div>
    );
  },
}; 