import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MedicalTestStatsGrid from '../../components/Dashboard/MedicalTestStatsGrid';

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('MedicalTestStatsGrid', () => {
  const mockStats = [
    {
      id: 'blood',
      label: 'Blood Tests',
      value: '234',
      change: '+5%'
    },
    {
      id: 'heart',
      label: 'ECG Tests',
      value: '156',
      change: '+8%'
    },
    {
      id: 'xray',
      label: 'X-Ray',
      value: '89',
      change: '+3%'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section title', () => {
    render(<MedicalTestStatsGrid stats={mockStats} />);
    expect(screen.getByText('Medical Test Statistics')).toBeInTheDocument();
  });

  it('renders all stat cards', () => {
    render(<MedicalTestStatsGrid stats={mockStats} />);
    
    expect(screen.getByText('Blood Tests')).toBeInTheDocument();
    expect(screen.getByText('234')).toBeInTheDocument();
    expect(screen.getByText('ECG Tests')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('X-Ray')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
  });

  it('renders export buttons', () => {
    render(<MedicalTestStatsGrid stats={mockStats} />);
    
    expect(screen.getByRole('button', { name: /csv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /excel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pdf/i })).toBeInTheDocument();
  });

  it('exports CSV when CSV button is clicked', () => {
    // Store original createElement
    const originalCreateElement = document.createElement.bind(document);
    const linkClickSpy = jest.fn();
    
    // Mock createElement only for this test
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tag) => {
      const element = originalCreateElement(tag);
      if (tag === 'a') {
        element.click = linkClickSpy;
      }
      return element;
    });

    render(<MedicalTestStatsGrid stats={mockStats} />);
    
    const csvButton = screen.getByRole('button', { name: /csv/i });
    fireEvent.click(csvButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(linkClickSpy).toHaveBeenCalled();
    
    createElementSpy.mockRestore();
  });

  it('exports Excel when Excel button is clicked', () => {
    const originalCreateElement = document.createElement.bind(document);
    const linkClickSpy = jest.fn();
    
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tag) => {
      const element = originalCreateElement(tag);
      if (tag === 'a') {
        element.click = linkClickSpy;
      }
      return element;
    });

    render(<MedicalTestStatsGrid stats={mockStats} />);
    
    const excelButton = screen.getByRole('button', { name: /excel/i });
    fireEvent.click(excelButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(linkClickSpy).toHaveBeenCalled();
    
    createElementSpy.mockRestore();
  });

  it('exports PDF when PDF button is clicked', () => {
    const mockWrite = jest.fn();
    const mockClose = jest.fn();
    const mockWindow = {
      document: {
        write: mockWrite,
        close: mockClose,
      }
    };
    
    const originalOpen = window.open;
    window.open = jest.fn(() => mockWindow);

    render(<MedicalTestStatsGrid stats={mockStats} />);
    
    const pdfButton = screen.getByRole('button', { name: /pdf/i });
    fireEvent.click(pdfButton);

    expect(window.open).toHaveBeenCalledWith('', '_blank');
    expect(mockWrite).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
    
    window.open = originalOpen;
  });

  it('handles empty stats array', () => {
    render(<MedicalTestStatsGrid stats={[]} />);
    
    expect(screen.getByText('Medical Test Statistics')).toBeInTheDocument();
    expect(screen.queryByText('Blood Tests')).not.toBeInTheDocument();
  });

  it('renders correct icons for each test type', () => {
    const allTestTypes = [
      { id: 'blood', label: 'Blood Tests', value: '10', change: '+1%' },
      { id: 'heart', label: 'Heart Tests', value: '20', change: '+2%' },
      { id: 'xray', label: 'X-Ray', value: '30', change: '+3%' },
      { id: 'urine', label: 'Urine Tests', value: '40', change: '+4%' },
      { id: 'audiometry', label: 'Hearing Tests', value: '50', change: '+5%' },
      { id: 'vision', label: 'Vision Tests', value: '60', change: '+6%' },
    ];

    const { container } = render(<MedicalTestStatsGrid stats={allTestTypes} />);
    
    // Each stat card should have an icon
    const icons = container.querySelectorAll('.w-9.h-9 svg');
    expect(icons.length).toBe(allTestTypes.length);
  });

  it('displays change percentage for each stat', () => {
    render(<MedicalTestStatsGrid stats={mockStats} />);
    
    expect(screen.getByText('+5%')).toBeInTheDocument();
    expect(screen.getByText('+8%')).toBeInTheDocument();
    expect(screen.getByText('+3%')).toBeInTheDocument();
  });

  it('displays helper text for each stat', () => {
    render(<MedicalTestStatsGrid stats={mockStats} />);
    
    const helperTexts = screen.getAllByText('Tests completed this period');
    expect(helperTexts.length).toBe(mockStats.length);
  });

  it('uses default stats array when not provided', () => {
    render(<MedicalTestStatsGrid />);
    
    expect(screen.getByText('Medical Test Statistics')).toBeInTheDocument();
  });
});