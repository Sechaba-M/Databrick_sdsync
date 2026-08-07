import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardSectionCard from '../../components/Dashboard/DashboardSectionCard';

describe('DashboardSectionCard', () => {
  it('renders with title and children', () => {
    render(
      <DashboardSectionCard title="Test Section">
        <div>Test Content</div>
      </DashboardSectionCard>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders search input when searchPlaceholder is provided', () => {
    render(
      <DashboardSectionCard 
        title="Test Section" 
        searchPlaceholder="Search here"
      >
        <div>Content</div>
      </DashboardSectionCard>
    );

    expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument();
  });

  it('does not render search input when searchPlaceholder is not provided', () => {
    render(
      <DashboardSectionCard title="Test Section">
        <div>Content</div>
      </DashboardSectionCard>
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', () => {
    const mockOnSearchChange = jest.fn();

    render(
      <DashboardSectionCard 
        title="Test Section" 
        searchPlaceholder="Search"
        onSearchChange={mockOnSearchChange}
      >
        <div>Content</div>
      </DashboardSectionCard>
    );

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    expect(mockOnSearchChange).toHaveBeenCalledWith('test query');
  });

  it('handles missing onSearchChange gracefully', () => {
    render(
      <DashboardSectionCard 
        title="Test Section" 
        searchPlaceholder="Search"
      >
        <div>Content</div>
      </DashboardSectionCard>
    );

    const searchInput = screen.getByPlaceholderText('Search');
    
    // Should not throw error
    expect(() => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
    }).not.toThrow();
  });

  it('renders blue indicator dot', () => {
    const { container } = render(
      <DashboardSectionCard title="Test">
        <div>Content</div>
      </DashboardSectionCard>
    );

    const dot = container.querySelector('.bg-blue-500');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('w-2', 'h-2', 'rounded-full');
  });

  it('renders search icon', () => {
    render(
      <DashboardSectionCard 
        title="Test" 
        searchPlaceholder="Search"
      >
        <div>Content</div>
      </DashboardSectionCard>
    );

    // lucide-react Search icon should be rendered
    expect(screen.getByPlaceholderText('Search').parentElement.querySelector('svg')).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout', () => {
    const { container } = render(
      <DashboardSectionCard title="Test">
        <div>Content</div>
      </DashboardSectionCard>
    );

    const section = container.firstChild;
    expect(section).toHaveClass('mt-6', 'bg-white', 'rounded-2xl', 'border', 'shadow-sm', 'p-4');
  });
});