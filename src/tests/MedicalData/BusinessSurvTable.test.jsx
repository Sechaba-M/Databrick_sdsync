import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessSurvTable from '../../components/MedicalData/BusinessSurvTable';

describe('BusinessSurvTable', () => {
  const mockData = [
    {
      unit: 'Manufacturing',
      employees: 150,
      monitoring: 'Air Monitoring\nBiological Monitoring',
      biomonitoring: 'Yes',
      category: 'Legislative',
      exams: ['Physical Exam', 'Respiratory Assessment'],
      tests: ['Blood Test', 'Urine Test'],
      frequency: 'Annually',
      limits: ['Limit 1', 'Limit 2']
    },
    {
      unit: 'Warehouse',
      employees: 50,
      monitoring: 'Air Monitoring',
      biomonitoring: 'No',
      category: 'Best Practice',
      exams: ['Basic Physical'],
      tests: ['Hearing Test'],
      frequency: 'Bi-annually',
      limits: ['Limit 3']
    }
  ];

  describe('Desktop/Tablet View', () => {
    beforeEach(() => {
      // Mock window.matchMedia to simulate desktop view
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('min-width'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    test('renders table with correct headers', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      // Headers also appear in mobile view labels, so use getAllByText
      expect(screen.getAllByText('Business Unit')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Employee Count')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Monitoring Type')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Biomonitoring')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Surveillance Category')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Physical Examinations')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Biological Tests')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Frequency')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Regulatory Limits')[0]).toBeInTheDocument();
    });

    test('renders all data rows', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Manufacturing')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Warehouse')[0]).toBeInTheDocument();
    });

    test('displays employee count with badge styling', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      expect(screen.getAllByText('150 Employees')[0]).toBeInTheDocument();
      expect(screen.getAllByText('50 Employees')[0]).toBeInTheDocument();
    });

    test('splits monitoring type by newlines', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      const monitoringCells = screen.getAllByText(/Air Monitoring/);
      expect(monitoringCells.length).toBeGreaterThan(0);
    });

    test('applies correct styling for Legislative category', () => {
      const { container } = render(<BusinessSurvTable data={mockData} />);
      
      const legislativeBadge = screen.getAllByText('Legislative')[0];
      expect(legislativeBadge).toHaveClass('bg-red-50', 'text-red-600');
    });

    test('applies correct styling for Best Practice category', () => {
      const { container } = render(<BusinessSurvTable data={mockData} />);
      
      const bestPracticeBadge = screen.getAllByText('Best Practice')[0];
      expect(bestPracticeBadge).toHaveClass('bg-blue-50', 'text-blue-700');
    });

    test('renders physical examinations as list', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Physical Exam')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Respiratory Assessment')[0]).toBeInTheDocument();
    });

    test('renders biological tests as list', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Blood Test')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Urine Test')[0]).toBeInTheDocument();
    });

    test('displays frequency correctly', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Annually')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Bi-annually')[0]).toBeInTheDocument();
    });

    test('displays regulatory limits', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Limit 1')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Limit 2')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Limit 3')[0]).toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    test('renders mobile card layout with all fields', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      // Check for mobile-specific labels
      const monitoringLabels = screen.getAllByText('Monitoring Type');
      const biomonitoringLabels = screen.getAllByText('Biomonitoring');
      const categoryLabels = screen.getAllByText('Surveillance Category');
      
      expect(monitoringLabels.length).toBeGreaterThan(0);
      expect(biomonitoringLabels.length).toBeGreaterThan(0);
      expect(categoryLabels.length).toBeGreaterThan(0);
    });

    test('displays biomonitoring value in mobile view', () => {
      render(<BusinessSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Yes')[0]).toBeInTheDocument();
      expect(screen.getAllByText('No')[0]).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('renders empty table when no data provided', () => {
      render(<BusinessSurvTable data={[]} />);
      
      // Headers should still be present
      expect(screen.getAllByText('Business Unit')[0]).toBeInTheDocument();
    });

    test('handles single item in arrays', () => {
      const singleItemData = [{
        unit: 'Office',
        employees: 10,
        monitoring: 'None',
        biomonitoring: 'No',
        category: 'Best Practice',
        exams: ['Annual Checkup'],
        tests: ['Vision Test'],
        frequency: 'Yearly',
        limits: ['Standard']
      }];

      render(<BusinessSurvTable data={singleItemData} />);
      
      expect(screen.getAllByText('Office')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Annual Checkup')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Vision Test')[0]).toBeInTheDocument();
    });

    test('handles multiline monitoring types correctly', () => {
      const multilineData = [{
        unit: 'Lab',
        employees: 20,
        monitoring: 'Line 1\nLine 2\nLine 3',
        biomonitoring: 'Yes',
        category: 'Legislative',
        exams: ['Exam'],
        tests: ['Test'],
        frequency: 'Monthly',
        limits: ['Limit']
      }];

      render(<BusinessSurvTable data={multilineData} />);
      
      expect(screen.getAllByText('Line 1')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Line 2')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Line 3')[0]).toBeInTheDocument();
    });

    test('renders correctly with empty arrays', () => {
      const emptyArraysData = [{
        unit: 'Empty Unit',
        employees: 0,
        monitoring: 'None',
        biomonitoring: 'No',
        category: 'Best Practice',
        exams: [],
        tests: [],
        frequency: 'N/A',
        limits: []
      }];

      render(<BusinessSurvTable data={emptyArraysData} />);
      
      expect(screen.getAllByText('Empty Unit')[0]).toBeInTheDocument();
      expect(screen.getAllByText('0 Employees')[0]).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    test('applies hover effect classes to table rows', () => {
      const { container } = render(<BusinessSurvTable data={mockData} />);
      
      const rows = container.querySelectorAll('tbody tr');
      rows.forEach(row => {
        expect(row).toHaveClass('hover:bg-gray-50', 'transition-colors');
      });
    });

    test('table has proper responsive classes', () => {
      const { container } = render(<BusinessSurvTable data={mockData} />);
      
      const desktopTable = container.querySelector('.hidden.md\\:block');
      expect(desktopTable).toBeInTheDocument();
      
      const mobileCards = container.querySelector('.md\\:hidden');
      expect(mobileCards).toBeInTheDocument();
    });

    test('applies correct background color to table header', () => {
      const { container } = render(<BusinessSurvTable data={mockData} />);
      
      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('bg-[#0B5794]', 'text-white');
    });
  });
});