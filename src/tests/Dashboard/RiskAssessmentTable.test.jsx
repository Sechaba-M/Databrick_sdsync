import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RiskAssessmentTable from '../../components/Dashboard/RiskAssessmentTable';

global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('RiskAssessmentTable', () => {
  const mockRows = [
    {
      title: 'Manufacturing - Q4 Assessment',
      date: 'Dec 2024',
      assessor: 'John Doe',
      chemicals: 'Acetone, Toluene, MEK',
      risk: 'Medium',
      recommendations: '3 pending'
    },
    {
      title: 'R&D Lab - Chemical Review',
      date: 'Nov 2024',
      assessor: 'Jane Smith',
      chemicals: 'Benzene, Chloroform',
      risk: 'High',
      recommendations: '5 pending'
    },
    {
      title: 'Warehouse - Safety Audit',
      date: 'Oct 2024',
      assessor: 'Bob Johnson',
      chemicals: 'None',
      risk: 'Low',
      recommendations: '0 pending'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table headers', () => {
    render(<RiskAssessmentTable rows={mockRows} />);
    
    expect(screen.getByText('Assessment Title')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Assessor')).toBeInTheDocument();
    expect(screen.getByText('Chemicals Evaluated')).toBeInTheDocument();
    expect(screen.getByText('Risk Level')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });

  it('renders all row data', () => {
    render(<RiskAssessmentTable rows={mockRows} />);
    
    expect(screen.getByText('Manufacturing - Q4 Assessment')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Acetone, Toluene, MEK')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Benzene, Chloroform')).toBeInTheDocument();
  });

  it('applies correct styling to High risk level', () => {
    render(<RiskAssessmentTable rows={mockRows} />);
    
    const highRiskBadge = screen.getByText('High');
    expect(highRiskBadge).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('applies correct styling to Medium risk level', () => {
    render(<RiskAssessmentTable rows={mockRows} />);
    
    const mediumRiskBadge = screen.getByText('Medium');
    expect(mediumRiskBadge).toHaveClass('bg-yellow-100', 'text-yellow-700');
  });

  it('applies correct styling to Low risk level', () => {
    render(<RiskAssessmentTable rows={mockRows} />);
    
    const lowRiskBadge = screen.getByText('Low');
    expect(lowRiskBadge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('renders export buttons', () => {
    render(<RiskAssessmentTable rows={mockRows} />);
    
    expect(screen.getByRole('button', { name: /csv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /excel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pdf/i })).toBeInTheDocument();
  });

  it('exports CSV when CSV button is clicked', () => {
    render(<RiskAssessmentTable rows={mockRows} />);
    
    const csvButton = screen.getByRole('button', { name: /csv/i });
    
    // Just verify the button is clickable and doesn't throw errors
    expect(() => {
      fireEvent.click(csvButton);
    }).not.toThrow();
    
    // Verify URL.createObjectURL was called for blob creation
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('exports Excel when Excel button is clicked', () => {
    render(<RiskAssessmentTable rows={mockRows} />);
    
    const excelButton = screen.getByRole('button', { name: /excel/i });
    
    expect(() => {
      fireEvent.click(excelButton);
    }).not.toThrow();
    
    expect(global.URL.createObjectURL).toHaveBeenCalled();
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

    render(<RiskAssessmentTable rows={mockRows} />);
    
    const pdfButton = screen.getByRole('button', { name: /pdf/i });
    fireEvent.click(pdfButton);

    expect(window.open).toHaveBeenCalledWith('', '_blank');
    expect(mockWrite).toHaveBeenCalled();
    
    window.open = originalOpen;
  });

  it('handles empty rows array', () => {
    render(<RiskAssessmentTable rows={[]} />);
    
    expect(screen.getByText('Assessment Title')).toBeInTheDocument();
    expect(screen.queryByText('Manufacturing - Q4 Assessment')).not.toBeInTheDocument();
  });

  it('alternates row background colors', () => {
    const { container } = render(<RiskAssessmentTable rows={mockRows} />);
    
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveClass('bg-white');
    expect(rows[1]).toHaveClass('bg-gray-50');
    expect(rows[2]).toHaveClass('bg-white');
  });

  it('uses default empty array when rows not provided', () => {
    render(<RiskAssessmentTable />);
    
    expect(screen.getByText('Assessment Title')).toBeInTheDocument();
  });

  it('renders table with overflow-x-auto wrapper', () => {
    const { container } = render(<RiskAssessmentTable rows={mockRows} />);
    
    const wrapper = container.querySelector('.overflow-x-auto');
    expect(wrapper).toBeInTheDocument();
  });

  it('applies correct header styling', () => {
    const { container } = render(<RiskAssessmentTable rows={mockRows} />);
    
    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('bg-[#003E77]', 'text-white');
  });
});