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
    
    // Check that all medal columns are present
    const goldColumn = canvas.getByLabelText('Sort by gold medals');
    const silverColumn = canvas.getByLabelText('Sort by silver medals');
    const bronzeColumn = canvas.getByLabelText('Sort by bronze medals');
    const totalColumn = canvas.getByLabelText('Sort by total medals');
    
    await expect(goldColumn).toBeInTheDocument();
    await expect(silverColumn).toBeInTheDocument();
    await expect(bronzeColumn).toBeInTheDocument();
    await expect(totalColumn).toBeInTheDocument();
    
    // Check that gold is active by default (should have top border)
    await expect(goldColumn).toHaveClass('border-t-2', 'border-black');
    
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
    const goldColumn = canvas.getByLabelText('Sort by gold medals');
    
    await expect(goldColumn).toHaveClass('border-t-2', 'border-black');
  },
};

export const SortBySilver: Story = {
  args: {
    sortBy: 'silver',
    onSort: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const silverColumn = canvas.getByLabelText('Sort by silver medals');
    
    await expect(silverColumn).toHaveClass('border-t-2', 'border-black');
  },
};

export const SortByBronze: Story = {
  args: {
    sortBy: 'bronze',
    onSort: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bronzeColumn = canvas.getByLabelText('Sort by bronze medals');
    
    await expect(bronzeColumn).toHaveClass('border-t-2', 'border-black');
  },
};

export const SortByTotal: Story = {
  args: {
    sortBy: 'total',
    onSort: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const totalColumn = canvas.getByLabelText('Sort by total medals');
    
    await expect(totalColumn).toHaveClass('border-t-2', 'border-black');
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
    const silverColumn = canvas.getByLabelText('Sort by silver medals');
    await userEvent.click(silverColumn);
    await expect(args.onSort).toHaveBeenCalledWith('silver');
    
    // Test clicking on bronze column
    const bronzeColumn = canvas.getByLabelText('Sort by bronze medals');
    await userEvent.click(bronzeColumn);
    await expect(args.onSort).toHaveBeenCalledWith('bronze');
    
    // Test clicking on total column
    const totalColumn = canvas.getByLabelText('Sort by total medals');
    await userEvent.click(totalColumn);
    await expect(args.onSort).toHaveBeenCalledWith('total');
    
    // Test clicking on gold column
    const goldColumn = canvas.getByLabelText('Sort by gold medals');
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
    const silverColumn = canvas.getByLabelText('Sort by silver medals');
    silverColumn.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSort).toHaveBeenCalledWith('silver');
    
    // Test Space key on bronze column
    const bronzeColumn = canvas.getByLabelText('Sort by bronze medals');
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
    
    // Check that all sort states are displayed
    const goldActive = canvas.getByLabelText('Sort by gold medals');
    const silverActive = canvas.getAllByLabelText('Sort by silver medals')[1]; // Second instance
    const bronzeActive = canvas.getAllByLabelText('Sort by bronze medals')[2]; // Third instance  
    const totalActive = canvas.getAllByLabelText('Sort by total medals')[3]; // Fourth instance
    
    await expect(goldActive).toHaveClass('border-t-2', 'border-black');
    await expect(silverActive).toHaveClass('border-t-2', 'border-black');
    await expect(bronzeActive).toHaveClass('border-t-2', 'border-black');
    await expect(totalActive).toHaveClass('border-t-2', 'border-black');
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