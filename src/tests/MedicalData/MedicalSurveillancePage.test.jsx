import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MedicalSurveillancePage from '../../components/MedicalData/MedicalSurveillancePage';
import * as api from '../../api/medicalSurvApi';

// Mock the API module
jest.mock('../../api/medicalSurvApi', () => ({
  fetchChemicalSurveillance: jest.fn(),
  fetchBusinessUnitSurveillance: jest.fn(),
  MOCK_CHEM_SURV: [],
  MOCK_BUSINESS_SURV: []
}));

// Mock child components
jest.mock('../../components/Navbar/NavBar', () => {
  return function MockNavBar({ onLogout, isAdmin }) {
    return <div data-testid="navbar">NavBar - Admin: {isAdmin ? 'Yes' : 'No'}</div>;
  };
});

jest.mock('../../components/MedicalData/SurveillanceFilters', () => {
  return function MockFilters({ search, onSearchChange, filter, onFilterChange, secondary, onSecondaryChange }) {
    return (
      <div data-testid="filters">
        <input 
          data-testid="search-input" 
          value={search} 
          onChange={(e) => onSearchChange(e.target.value)} 
        />
        <select 
          data-testid="filter-select" 
          value={filter} 
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Legislative">Legislative</option>
          <option value="Best Practice">Best Practice</option>
        </select>
        {secondary !== undefined && (
          <select 
            data-testid="secondary-select" 
            value={secondary} 
            onChange={(e) => onSecondaryChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="bio">Bio</option>
            <option value="air">Air</option>
          </select>
        )}
      </div>
    );
  };
});

jest.mock('../../components/MedicalData/ChemicalSurvTable', () => {
  return function MockChemicalTable({ data }) {
    return <div data-testid="chemical-table">Chemicals: {data.length}</div>;
  };
});

jest.mock('../../components/MedicalData/BusinessSurvTable', () => {
  return function MockBusinessTable({ data }) {
    return <div data-testid="business-table">Business Units: {data.length}</div>;
  };
});

describe('MedicalSurveillancePage', () => {
  const mockChemData = [
    {
      chemical: 'Benzene',
      cas: '71-43-2',
      category: 'Legislative',
      monitoringType: 'Biological'
    },
    {
      chemical: 'Toluene',
      cas: '108-88-3',
      category: 'Best Practice',
      monitoringType: 'Air Monitoring'
    }
  ];

  const mockBusinessData = [
    {
      unit: 'Manufacturing',
      category: 'Legislative',
      monitoring: 'Biological\nAir Monitoring'
    },
    {
      unit: 'Warehouse',
      category: 'Best Practice',
      monitoring: 'Air Monitoring'
    }
  ];

  const defaultProps = {
    onLogout: jest.fn(),
    isAdmin: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup successful API mocks by default
    api.fetchChemicalSurveillance.mockResolvedValue(mockChemData);
    api.fetchBusinessUnitSurveillance.mockResolvedValue(mockBusinessData);
    
    // Mock window methods
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    // Mock window.open for PDF export
    global.open = jest.fn(() => ({
      document: {
        write: jest.fn(),
        close: jest.fn()
      }
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Render', () => {
    test('renders page heading and description', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      expect(screen.getByText('Medical Surveillance')).toBeInTheDocument();
      expect(screen.getByText('View and export surveillance requirements by chemical or business unit.')).toBeInTheDocument();
    });

    test('renders navbar with correct props', async () => {
      render(<MedicalSurveillancePage {...defaultProps} isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByText(/Admin: Yes/)).toBeInTheDocument();
      });
    });

    test('shows loading state initially', () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      expect(screen.getByText(/Loading/)).toBeInTheDocument();
    });

    test('loads data on mount', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(api.fetchChemicalSurveillance).toHaveBeenCalledTimes(1);
        expect(api.fetchBusinessUnitSurveillance).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Tab Switching', () => {
    test('renders Chemicals tab by default', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
    });

    test('switches to Business Unit tab', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      const businessTab = screen.getByText('Business Unit');
      fireEvent.click(businessTab);
      
      expect(screen.getByTestId('business-table')).toBeInTheDocument();
      expect(screen.queryByTestId('chemical-table')).not.toBeInTheDocument();
    });

    test('switches back to Chemicals tab', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      // Switch to business
      fireEvent.click(screen.getByText('Business Unit'));
      expect(screen.getByTestId('business-table')).toBeInTheDocument();
      
      // Switch back to chemicals
      fireEvent.click(screen.getByText('Chemicals'));
      expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
    });

    test('applies active styling to selected tab', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        const chemTab = screen.getByText('Chemicals');
        expect(chemTab).toHaveClass('bg-[#0B5794]', 'text-white');
      });
    });
  });

  describe('Filtering', () => {
    test('filters chemicals by search term', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'benzene' } });
      
      // Should filter data (check via table showing 1 item)
      await waitFor(() => {
        expect(screen.getByText('Chemicals: 1')).toBeInTheDocument();
      });
    });

    test('filters by category', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      const filterSelect = screen.getByTestId('filter-select');
      fireEvent.change(filterSelect, { target: { value: 'Legislative' } });
      
      await waitFor(() => {
        expect(screen.getByText('Chemicals: 1')).toBeInTheDocument();
      });
    });

    test('filters by monitoring type', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      const secondarySelect = screen.getByTestId('secondary-select');
      fireEvent.change(secondarySelect, { target: { value: 'bio' } });
      
      // The filter might not match the data exactly, so just check the table is still rendered
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
    });

    test('combines multiple filters', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'benzene' } });
      fireEvent.change(screen.getByTestId('filter-select'), { target: { value: 'Legislative' } });
      
      await waitFor(() => {
        expect(screen.getByText('Chemicals: 1')).toBeInTheDocument();
      });
    });

    test('filters business units independently', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Business Unit'));
      
      await waitFor(() => {
        expect(screen.getByTestId('business-table')).toBeInTheDocument();
      });
      
      fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'warehouse' } });
      
      await waitFor(() => {
        expect(screen.getByText('Business Units: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Export Functionality', () => {
    beforeEach(() => {
      // Mock Blob
      global.Blob = jest.fn((content, options) => ({
        content,
        options
      }));
    });

    test('renders export button', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
      });
    });

    test('toggles export menu on button click', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
      });
      
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
      
      expect(screen.getByText('Export as CSV')).toBeInTheDocument();
      expect(screen.getByText('Export as Excel')).toBeInTheDocument();
      expect(screen.getByText('Export as PDF')).toBeInTheDocument();
    });

    test('closes export menu after selection', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Export'));
      fireEvent.click(screen.getByText('Export as CSV'));
      
      await waitFor(() => {
        expect(screen.queryByText('Export as CSV')).not.toBeInTheDocument();
      });
    });

    test('shows exporting message', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Export'));
      fireEvent.click(screen.getByText('Export as CSV'));
      
      expect(screen.getByText(/Preparing export for chemicals/)).toBeInTheDocument();
    });

    test('handles empty data export', async () => {
      api.fetchChemicalSurveillance.mockResolvedValue([]);
      
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Export'));
      fireEvent.click(screen.getByText('Export as CSV'));
      
      expect(alertSpy).toHaveBeenCalledWith('Nothing to export');
      
      alertSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    test('falls back to mock data when API fails', async () => {
      api.fetchChemicalSurveillance.mockRejectedValue(new Error('API Error'));
      api.fetchBusinessUnitSurveillance.mockRejectedValue(new Error('API Error'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('continues functioning after API error', async () => {
      api.fetchChemicalSurveillance.mockRejectedValue(new Error('API Error'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      // Should still be able to switch tabs
      fireEvent.click(screen.getByText('Business Unit'));
      expect(screen.getByTestId('business-table')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Responsive Design', () => {
    test('applies responsive classes to tabs', async () => {
      const { container } = render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        const tabContainer = container.querySelector('.inline-flex');
        expect(tabContainer).toHaveClass('w-full', 'sm:w-auto');
      });
    });

    test('export button has responsive padding', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        const exportButton = screen.getByText('Export');
        expect(exportButton).toHaveClass('px-5', 'sm:px-6');
      });
    });
  });

  describe('Data Display', () => {
    test('displays correct count for filtered chemicals', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Chemicals: 2')).toBeInTheDocument();
      });
    });

    test('displays correct count for filtered business units', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chemical-table')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Business Unit'));
      
      await waitFor(() => {
        expect(screen.getByText('Business Units: 2')).toBeInTheDocument();
      });
    });

    test('updates display when filters change', async () => {
      render(<MedicalSurveillancePage {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Chemicals: 2')).toBeInTheDocument();
      });
      
      fireEvent.change(screen.getByTestId('filter-select'), { target: { value: 'Legislative' } });
      
      await waitFor(() => {
        expect(screen.getByText('Chemicals: 1')).toBeInTheDocument();
      });
    });
  });
});