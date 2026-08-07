import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SurveillanceFilters from '../../components/MedicalData/SurveillanceFilters';

describe('SurveillanceFilters', () => {
  const defaultProps = {
    search: '',
    onSearchChange: jest.fn(),
    filter: 'all',
    onFilterChange: jest.fn(),
    secondary: 'all',
    onSecondaryChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Search Input', () => {
    test('renders search input with placeholder', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search chemical, CAS number or business unit...');
      expect(searchInput).toBeInTheDocument();
    });

    test('displays current search value', () => {
      render(<SurveillanceFilters {...defaultProps} search="benzene" />);
      
      const searchInput = screen.getByPlaceholderText('Search chemical, CAS number or business unit...');
      expect(searchInput).toHaveValue('benzene');
    });

    test('calls onSearchChange when typing', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search chemical, CAS number or business unit...');
      fireEvent.change(searchInput, { target: { value: 'toluene' } });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('toluene');
    });

    test('calls onSearchChange with empty string when cleared', () => {
      render(<SurveillanceFilters {...defaultProps} search="test" />);
      
      const searchInput = screen.getByPlaceholderText('Search chemical, CAS number or business unit...');
      fireEvent.change(searchInput, { target: { value: '' } });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('Primary Filter (Category)', () => {
    test('renders category filter dropdown', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const filterSelect = screen.getByDisplayValue('Filter: All Categories');
      expect(filterSelect).toBeInTheDocument();
    });

    test('displays all category options', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const filterSelect = screen.getByDisplayValue('Filter: All Categories');
      
      expect(filterSelect).toContainHTML('<option value="all">Filter: All Categories</option>');
      expect(filterSelect).toContainHTML('<option value="Legislative">Legislative</option>');
      expect(filterSelect).toContainHTML('<option value="Best Practice">Best Practice</option>');
    });

    test('displays current filter value', () => {
      render(<SurveillanceFilters {...defaultProps} filter="Legislative" />);
      
      const filterSelect = screen.getByDisplayValue('Legislative');
      expect(filterSelect).toBeInTheDocument();
    });

    test('calls onFilterChange when selection changes', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const filterSelect = screen.getByDisplayValue('Filter: All Categories');
      fireEvent.change(filterSelect, { target: { value: 'Legislative' } });
      
      expect(defaultProps.onFilterChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('Legislative');
    });

    test('can change back to all categories', () => {
      render(<SurveillanceFilters {...defaultProps} filter="Legislative" />);
      
      const filterSelect = screen.getByDisplayValue('Legislative');
      fireEvent.change(filterSelect, { target: { value: 'all' } });
      
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('all');
    });
  });

  describe('Secondary Filter (Monitoring Type)', () => {
    test('renders secondary filter when provided', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const secondarySelect = screen.getByDisplayValue('Monitoring Type');
      expect(secondarySelect).toBeInTheDocument();
    });

    test('does not render secondary filter when undefined', () => {
      const propsWithoutSecondary = {
        ...defaultProps,
        secondary: undefined,
        onSecondaryChange: undefined
      };
      
      render(<SurveillanceFilters {...propsWithoutSecondary} />);
      
      const selects = screen.getAllByRole('combobox');
      expect(selects).toHaveLength(1); // Only primary filter
    });

    test('displays monitoring type options', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const secondarySelect = screen.getByDisplayValue('Monitoring Type');
      
      expect(secondarySelect).toContainHTML('<option value="all">Monitoring Type</option>');
      expect(secondarySelect).toContainHTML('<option value="bio">Biological</option>');
      expect(secondarySelect).toContainHTML('<option value="air">Air Monitoring</option>');
    });

    test('displays current secondary filter value', () => {
      render(<SurveillanceFilters {...defaultProps} secondary="bio" />);
      
      const secondarySelect = screen.getByDisplayValue('Biological');
      expect(secondarySelect).toBeInTheDocument();
    });

    test('calls onSecondaryChange when selection changes', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const secondarySelect = screen.getByDisplayValue('Monitoring Type');
      fireEvent.change(secondarySelect, { target: { value: 'bio' } });
      
      expect(defaultProps.onSecondaryChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onSecondaryChange).toHaveBeenCalledWith('bio');
    });

    test('can change between monitoring types', () => {
      render(<SurveillanceFilters {...defaultProps} secondary="bio" />);
      
      const secondarySelect = screen.getByDisplayValue('Biological');
      fireEvent.change(secondarySelect, { target: { value: 'air' } });
      
      expect(defaultProps.onSecondaryChange).toHaveBeenCalledWith('air');
    });
  });

  describe('Filter Icons', () => {
    test('renders filter icons for dropdown selects', () => {
      const { container } = render(<SurveillanceFilters {...defaultProps} />);
      
      const filterIcons = container.querySelectorAll('svg');
      expect(filterIcons.length).toBeGreaterThanOrEqual(2); // At least 2 filter icons
    });
  });

  describe('Layout and Styling', () => {
    test('applies correct container classes', () => {
      const { container } = render(<SurveillanceFilters {...defaultProps} />);
      
      const filterContainer = container.querySelector('.bg-white.rounded-xl');
      expect(filterContainer).toBeInTheDocument();
      expect(filterContainer).toHaveClass('p-4', 'border', 'border-gray-200', 'shadow-sm');
    });

    test('search input has focus ring styling', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search chemical, CAS number or business unit...');
      expect(searchInput).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-[#0B5794]');
    });

    test('filter selects have focus ring styling', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const selects = screen.getAllByRole('combobox');
      selects.forEach(select => {
        expect(select).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-[#0B5794]');
      });
    });

    test('applies responsive classes', () => {
      const { container } = render(<SurveillanceFilters {...defaultProps} />);
      
      const searchInput = container.querySelector('input[type="text"]');
      expect(searchInput).toHaveClass('w-full', 'md:w-1/3');
    });
  });

  describe('Accessibility', () => {
    test('search input is accessible', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search chemical, CAS number or business unit...');
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    test('select elements are accessible', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Integration', () => {
    test('all filters can be used together', () => {
      render(<SurveillanceFilters {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search chemical, CAS number or business unit...');
      const primaryFilter = screen.getByDisplayValue('Filter: All Categories');
      const secondaryFilter = screen.getByDisplayValue('Monitoring Type');
      
      fireEvent.change(searchInput, { target: { value: 'benzene' } });
      fireEvent.change(primaryFilter, { target: { value: 'Legislative' } });
      fireEvent.change(secondaryFilter, { target: { value: 'bio' } });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('benzene');
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('Legislative');
      expect(defaultProps.onSecondaryChange).toHaveBeenCalledWith('bio');
    });

    test('filters maintain independent state', () => {
      const { rerender } = render(<SurveillanceFilters {...defaultProps} />);
      
      // Update search
      rerender(<SurveillanceFilters {...defaultProps} search="test" />);
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Filter: All Categories')).toBeInTheDocument();
      
      // Update primary filter
      rerender(<SurveillanceFilters {...defaultProps} search="test" filter="Legislative" />);
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Legislative')).toBeInTheDocument();
      
      // Update secondary filter
      rerender(<SurveillanceFilters {...defaultProps} search="test" filter="Legislative" secondary="bio" />);
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Legislative')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Biological')).toBeInTheDocument();
    });
  });
});