import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { TableSkeleton } from './index';

const meta: Meta<typeof TableSkeleton> = {
  title: 'Table Skeleton',
  component: TableSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: 'number',
      description: 'Number of skeleton rows to display',
      defaultValue: 8,
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
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that skeleton has proper accessibility attributes
    const skeleton = canvas.getByRole('status');
    await expect(skeleton).toHaveAttribute('aria-live', 'polite');
    await expect(skeleton).toHaveAttribute('aria-busy', 'true');
    
    // Check that table skeleton element is present
    const tableSkeletonElement = canvas.getByTestId('table-skeleton');
    await expect(tableSkeletonElement).toBeInTheDocument();
    
    // Check that header skeleton is present
    const headerSkeleton = canvas.getByTestId('table-header-skeleton');
    await expect(headerSkeleton).toBeInTheDocument();
    
    // Check that skeleton rows are present (13 by default)
    const skeletonRows = canvas.getAllByTestId('table-row-skeleton');
    await expect(skeletonRows).toHaveLength(13);
    
    // Check that loading message is present for screen readers
    await expect(canvas.getByText('Loading dashboard...')).toHaveClass('sr-only');
  },
};

export const FewRows: Story = {
  args: {
    rows: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that only 3 skeleton rows are present
    const skeletonRows = canvas.getAllByTestId('table-row-skeleton');
    await expect(skeletonRows).toHaveLength(3);
    
    // Check that header is still present
    const headerSkeleton = canvas.getByTestId('table-header-skeleton');
    await expect(headerSkeleton).toBeInTheDocument();
  },
};

export const ManyRows: Story = {
  args: {
    rows: 15,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that 15 skeleton rows are present
    const skeletonRows = canvas.getAllByTestId('table-row-skeleton');
    await expect(skeletonRows).toHaveLength(15);
    
    // Check that header is still present
    const headerSkeleton = canvas.getByTestId('table-header-skeleton');
    await expect(headerSkeleton).toBeInTheDocument();
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'opacity-75',
    rows: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that 5 skeleton rows are present
    const skeletonRows = canvas.getAllByTestId('table-row-skeleton');
    await expect(skeletonRows).toHaveLength(5);
    
    // Check that custom class is applied to the container
    const container = canvasElement.querySelector('.max-w-xl');
    await expect(container).toHaveClass('opacity-75');
  },
};

export const Animation: Story = {
  args: {
    rows: 6,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that 6 skeleton rows are present
    const skeletonRows = canvas.getAllByTestId('table-row-skeleton');
    await expect(skeletonRows).toHaveLength(6);
    
    // Check that animation class is present
    const animatedContainer = canvasElement.querySelector('.animate-pulse');
    await expect(animatedContainer).toBeInTheDocument();
  },
}; 